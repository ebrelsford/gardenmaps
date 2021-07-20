#!/usr/bin/python

#
# generate json files containing just the ids of gardens that has each selector in a batch of selectors
#

import csv
import json
import re
import sys

import garden_csv

def read_gardens(filename):
    return [dict(garden) for garden in csv.DictReader(open(filename, 'rU'), dialect='excel')]

gardens = read_gardens(sys.argv[1])
gardens = [g for g in gardens if g['DescripSource'] == 'GrowNYC Community Garden Survey 2009/2010' and not g['Geocode Accuracy'].startswith('APPROX')]

def only_composted_in_past(garden):
    return garden['CurrentCompost'] == 'No' and garden['PastCompost'] == 'Yes'

def only_wants_to_compost(garden):
    return garden['CurrentCompost'] == 'No' and garden['FutureCompost'] == 'Yes'

def get_garden_ids(selector):
    if selector is None:
        return None

    for c in garden_csv.list_columns.keys():
        if selector in garden_csv.headers[c]:
            return get_garden_ids_from_list_column(garden_csv.list_columns[c], selector)

    if selector in garden_csv.yes_columns:
        return get_garden_ids_from_yes_column(selector)

    # thus starts the parade of special cases
    if selector == 'PastCompost':
        return [int(garden['GARDENID']) for garden in gardens if only_composted_in_past(garden)]
    if selector == 'FutureCompost':
        return [int(garden['GARDENID']) for garden in gardens if only_wants_to_compost(garden)]

    return get_garden_ids_simple(selector)

def get_garden_ids_simple(selector):
    """Get IDs from a single column named the same as the given selector"""
    return [int(garden['GARDENID']) for garden in gardens if (garden[selector] != None and garden[selector] != "")]

def get_garden_ids_from_list_column(column_name, selector):
    """Get IDs from a single column that will potentially contain a list of selectors"""
    return [int(garden['GARDENID']) for garden in gardens if (garden[column_name].find(selector) != -1)]   

def get_garden_ids_from_yes_column(selector):
    """Get IDs from a single column that contains 'yes' or 'no'"""
    return [int(garden['GARDENID']) for garden in gardens if garden[selector].lower().startswith('yes')]   

def get_garden_ids_match(selector, value):
    return [int(garden['GARDENID']) for garden in gardens if garden[selector] == value]   

def get_file_name(selector):
    return re.sub("[^\d\w\%]", "_", selector) + '.json'

for selector in (reduce(lambda a, b: a+b, garden_csv.headers.values())):
    ids = get_garden_ids(selector)
    outfile = open(get_file_name(selector), 'w')
    json.dump(ids, outfile)

# community boards
boroughCommunityBoards = {
    'manhattan': { 'ids': range(1, 13), 'id': '1' },
    'bronx': { 'ids': range(1, 13), 'id': '2' },
    'brooklyn': { 'ids': range(1, 19), 'id': '3' },
    'queens': { 'ids': range(1, 15), 'id': '4' },
    'staten_island': { 'ids': range(1, 4), 'id': '5' },
}

for borough, info in boroughCommunityBoards.items():
    for cb in info['ids']:
        cb_ids = get_garden_ids_match('CB', str(cb))
        borough_ids = get_garden_ids_match('Boro', info['id'])
        outfile = open('cb_%s_%d.json' % (borough, cb), 'w')
        json.dump(list(set(cb_ids).intersection(set(borough_ids))), outfile)

# city council districts
for cd in range(1,52):
    ids = get_garden_ids_match('CD', str(cd))
    outfile = open('cd_' + str(cd) + '.json', 'w')
    json.dump(ids, outfile)

