#!/usr/bin/python

#
# Generate a json file for each garden. This file contains all of the useful details for a given garden.
#

import json, csv, sys

import garden_csv

def get_property_from_list(garden, columns):
    values = [garden[column] for column in columns if garden[column] != None and garden[column] != ""]
    if len(values) > 0:
        return values[0].lower()
    else:
        return ""

# Get all non-empty values from a list of columns
def get_properties_from_list(garden, columns):
	return [garden[column].lower() for column in columns if garden[column] != None and garden[column] != ""]

def get_headers(attribute):
    return garden_csv.headers[attribute]

def get_simple_attributes_from_list(garden, attribute):
	return sorted(get_properties_from_list(garden, get_headers(attribute)))

def get_simple_attribute_from_list(garden, attribute):
	return get_property_from_list(garden, get_headers(attribute))

def get_tree_attributes(garden):
    return [get_tree_attribute(garden, tree) for tree in sorted(get_headers('trees')) if get_tree_attribute(garden, tree) is not None]

def get_tree_attribute(garden, tree):
    number_of_trees = get_simple_attribute(garden, tree)
    if len(number_of_trees) == 0:
        return None
    return number_of_trees + ' ' + tree.lower()

def get_simple_attribute(garden, attribute, lower=True):
    if attribute not in garden:
        return ""
    if lower:
        return garden[attribute].lower()
    return garden[attribute]

def get_yes_no_attribute(garden, attribute):
    if garden[attribute] == 'Yes':
        return 'yes'
    return 'no'


def get_food(garden):
    return {
        'vegetables': get_simple_attributes_from_list(garden, 'vegetables'),
        'fruits': get_simple_attributes_from_list(garden, 'fruits'),
        'greens': get_simple_attributes_from_list(garden, 'greens'),
        'trees': get_tree_attributes(garden),
        'herbs': get_simple_attributes_from_list(garden, 'herbs')
    }

def get_obj(garden):
    return {
        'id': get_simple_attribute(garden, 'GARDENID'),
        'surveyed': garden['DescripSource'] == 'GrowNYC Community Garden Survey 2009/2010',
        'name': get_simple_attribute(garden, 'Current Name', lower=False),
        'description': get_simple_attribute(garden, 'Description', lower=False),
        'address': get_simple_attribute(garden, 'Fixed Address', lower=False),
        'borough': get_simple_attribute(garden, 'Borough', lower=False),
        'neighborhood': get_simple_attribute(garden, 'Neighborhood', lower=False),
        'community_board': get_simple_attribute(garden, 'CB', lower=False),
        'council_district': get_simple_attribute(garden, 'CD', lower=False),
        'year_started': get_simple_attribute(garden, 'YearFounded'),
        'website': get_simple_attribute(garden, 'Garden Website'),
        'languages_spoken': get_simple_attribute(garden, 'Languages_Spoken'),
        'events': get_simple_attributes_from_list(garden, 'events'),
        'fences': get_simple_attribute(garden, 'Fence'),
        'food': get_food(garden),
        'dues': get_yes_no_attribute(garden, 'Dues'),
        'waitlist': get_yes_no_attribute(garden, 'Waiting_List'),
        'previous_use': get_simple_attribute(garden, 'BeforeTheGarden'),
        'water features': get_simple_attributes_from_list(garden, 'water features'),
        'private events': get_simple_attributes_from_list(garden, 'private events'),
        'other_plants': get_simple_attributes_from_list(garden, 'inedibles'),
        'ownership': get_simple_attribute(garden, 'Land Jurisdiction', lower=False),
        'food use': get_simple_attributes_from_list(garden, 'food use'),
        'perceived edibility': get_simple_attribute(garden, 'PercentEdible'),
        'composts currently': get_yes_no_attribute(garden, 'CurrentCompost'),
        'who composts': get_simple_attribute_from_list(garden, 'who composts'),
        'structures': get_simple_attributes_from_list(garden, 'structures'),
        'art': get_simple_attributes_from_list(garden, 'art'),
        'water features': get_simple_attributes_from_list(garden, 'water features'),
        'events': get_simple_attributes_from_list(garden, 'events'),
        'works with schools': get_yes_no_attribute(garden, 'PartnersWSchool'),
        'volunteers needed': get_yes_no_attribute(garden, 'HostsVolunteers'),
        'open hours': get_simple_attribute(garden, 'Open_Hours', lower=False),
    }

def output_json(garden):
    json_file = open(garden['GARDENID'] + '.json', 'w')
    json.dump(get_obj(garden), json_file)

def load_gardens():
    gardens = csv.DictReader(open(sys.argv[1], 'rU'), dialect='excel')

    for garden in gardens:
        output_json(garden)

load_gardens()

