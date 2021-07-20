#!/usr/bin/python

import json, sys, re

import garden_csv

menu_names = {
    '0-25%': '0-25%',
    '26-50%': '26-50%',
    '51-75%': '51-75%',
    '76-100%': '76-100%',
    'CompostGardenMembersOnly': 'members only',
    'CompostGardenMembers & neighborhood residents': 'members and neighbors',
    'CompostPublic': 'anyone',
    'PastCompost': 'used to',
    'FutureCompost': 'would like to',
    'Used by growers': 'by growers',
    'Donated': 'donated',
    'Sold': 'sold',
    'Sold at a Market': 'sold at a market',
    'NYC Dept. of Parks & Recreation': 'parks & recreation', 
    'TPL': 'the trust for public land',
    'NYRP': 'nyrp', 
    'HRA': 'human resources administration', 
    'MTA': 'mta', 
    'Church': 'church', 
    'Private': 'private', 
    'Dept. of Education': 'dept of education', 
    'DOT': 'dept of transportation', 
    'HPD': 'dept of housing preservation and development', 
    'State': 'new york state', 
}

readable_names = {
    'CompostGardenMembersOnly': 'only members can compost',
    'CompostGardenMembers & neighborhood residents': 'only members and neighbors can compost',
    'CompostPublic': 'anyone can compost',
    'PastCompost': 'used to compost',
    'FutureCompost': 'would like to compost',
    'PartnersWCommGrp': 'partners with community group',
    'Comm Garden workshops': 'garden workshops',
    'Comm Off-site workshops': 'off-site workshops',
    'Comm Educational events': 'educational events',
    'Comm Nothing yet, but would like to': 'not yet, but would like to',
    'PartnersWSchool': 'partners with schools',
    'School garden/plot': 'school garden or plot',
    'School Educational events': 'school educational events',
    'School Regular visits by classes': 'school regular visits',
    'In-school workshops': 'in-school workshops',
    'School Nothing yet, but we would like to': 'nothing yet, but would like to',
    'CanRent': 'can be rented', 
    'Members only (no non-members can rent garden)': 'only members can rent', 
    'Members and non-members can rent': 'anyone can rent',
    'Reservation only': 'rental by reservation only',
    'Reservation & rental fee': 'rental by reservation and fee',
    'InformalRent': 'no formal rental system',
    'Table(s)': 'tables',
    'Mural': 'murals',
    'Sculpture(s)': 'sculptures',
    '0-25%': '0-25% edible',
    '26-50%': '26-50% edible',
    '51-75%': '51-75% edible',
    '76-100%': '76-100% edible',
    'Used by growers': 'food is used by growers',
    'Donated': 'food is donated',
    'Sold': 'food is sold',
    'Sold at a Market': 'food is sold at a market',
    'NYC Dept. of Parks & Recreation': 'owned by dept of parks & recreation', 
    'TPL': 'owned by the trust for public land',
    'NYRP': 'owned by nyrp', 
    'HRA': 'owned by human resources administration', 
    'MTA': 'owned by mta', 
    'Church': 'owned by a church', 
    'Private': 'privately owned', 
    'Dept. of Education': 'owned by dept of education', 
    'DOT': 'owned by dept of transportation', 
    'HPD': 'owned by dept of housing preservation and development', 
    'State': 'owned by new york state', 
    
}

def get_label(name):
    if name in menu_names:
        return menu_names[name]
    elif name in readable_names:
        return readable_names[name]

    name = re.subn('([a-z])([A-Z])', '\g<1> \g<2>', name)[0]
    return name.lower().replace('_', ' ')

def get_selected_label(name):
    """Get the label that will be shown in the legend when this feature is selected"""
    if name in readable_names:
        return readable_names[name]

    name = re.subn('([a-z])([A-Z])', '\g<1> \g<2>', name)[0]
    return name.lower().replace('_', ' ')

def make_menu_item(name, label=None, selectedLabel=None):
    if not label:
        label = get_label(name)
    if not selectedLabel:
        selectedLabel = get_selected_label(name)

    return {
        'label': label,
        'selectedLabel': selectedLabel,
        'id': re.sub("[^\d\w\%]", "_", name),
    }

def make_menu_item_with_label(label, name):
    return make_menu_item(name, label=label, selectedLabel=label)

def make_menu(name, item_names):
    return {
        'label': name,
        'items': sorted(get_menu_items(item_names), key=lambda it: it['label'])
    }

def get_menu_items(names):
    return [make_menu_item(name) for name in names]

def make_compost_menu():
    return [
        make_menu_item('PastCompost'),
        {
            'label': 'currently do', 
            'items': [
                make_menu_item('CompostGardenMembersOnly'),
                make_menu_item('CompostGardenMembers & neighborhood residents'),
                make_menu_item('CompostPublic')
            ]
        },
        make_menu_item('FutureCompost')
    ]

def make_food_menu():
    return [
        make_menu('percent of garden that is edible', garden_csv.headers['perceived edibility']),
        {
            'label': 'types',
            'items': [make_menu(food, garden_csv.headers[food]) for food in ('fruits', 'greens', 'herbs', 'trees', 'vegetables')]
        },
        make_menu('use', garden_csv.headers['food use'])
    ]

menu = [
    make_menu('art', garden_csv.headers['art']),
    {
        'label': 'compost',
        'items': make_compost_menu()
    },
    {
        'label': 'events',
        'items': [
            make_menu('public', garden_csv.headers['events']),
            make_menu('private', garden_csv.headers['private events'])
        ]
    },
    {
        'label': 'food',
        'items': make_food_menu()
    },
    {
        'label': 'location',
        'items': [
            {
                'label': 'city council district',
                'items': [
                    {
                        'label': '1-15',
                        'items': [make_menu_item('cd_%d' % i, label=str(i), selectedLabel='city council district %d' % i) for i in range(1, 16)],
                    },
                    {
                        'label': '16-30',
                        'items': [make_menu_item('cd_%d' % i, label=str(i), selectedLabel='city council district %d' % i) for i in range(16, 31)],
                    },
                    {
                        'label': '31-51',
                        'items': [make_menu_item('cd_%d' % i, label=str(i), selectedLabel='city council district %d' % i) for i in range(31, 52)],
                    },
                ],
            },

            {
                'label': 'community board',
                'items': [
                    {
                        'label': 'Brooklyn',
                        'items': [make_menu_item('cb_brooklyn_' + str(i), label=str(i), selectedLabel='Brooklyn community board %d' % i) for i in range(1,19)],
                    },
                    {
                        'label': 'Bronx',
                        'items': [make_menu_item('cb_bronx_' + str(i), label=str(i), selectedLabel='Bronx community board %d' % i) for i in range(1,13)],
                    },
                    {
                        'label': 'Manhattan',
                        'items': [make_menu_item('cb_manhattan_' + str(i), label=str(i), selectedLabel='Manhattan community board %d' % i) for i in range(1,13)],
                    },
                    {
                        'label': 'Queens',
                        'items': [make_menu_item('cb_queens_' + str(i), label=str(i), selectedLabel='Queens community board %d' % i) for i in range(1,15)],
                    },
                    {
                        'label': 'Staten Island',
                        'items': [make_menu_item('cb_staten_island_' + str(i), label=str(i), selectedLabel='Staten Island community board %d' % i) for i in range(1, 4)],
                    },
                ]
            },
        ]
    },
    make_menu('ornamental plants', garden_csv.headers['inedibles']),
    make_menu('ownership', garden_csv.headers['ownership']),
    {
        'label': 'partnerships',
        'items': [
            {
                'label': 'community groups',
                'items': [
                    make_menu_item('PartnersWCommGrp'),
                    make_menu_item('Comm Garden workshops'),
                    make_menu_item('Comm Off-site workshops'),
                    make_menu_item('Comm Educational events'),
                    make_menu_item('Comm Nothing yet, but would like to')
                ]
            },
            {
                'label': 'schools',
                'items': [
                    make_menu_item('PartnersWSchool'),
                    make_menu_item('School garden/plot'),
                    make_menu_item('School Educational events'),
                    make_menu_item('School Regular visits by classes'),
                    make_menu_item('In-school workshops'),
                    make_menu_item('School Nothing yet, but we would like to'),
                ]
            }
        ]
    },
    {
        'label': 'structures',
        'items': [make_menu('fences', garden_csv.headers['fences']),] + get_menu_items(garden_csv.headers['structures'])
    },
    make_menu('volunteers', garden_csv.headers['volunteers']),
    make_menu('water features', garden_csv.headers['water features'])
]
json.dump(menu, sys.stdout)
