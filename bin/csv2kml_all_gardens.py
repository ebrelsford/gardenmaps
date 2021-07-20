#!/usr/bin/python

#
# generate kml for all gardens
#

import sys
import unicodecsv as csv
from genshi.template import TemplateLoader

gardens = csv.DictReader(open(sys.argv[2], 'rU'), dialect='excel')
gardens = [g for g in gardens if not g['Geocode Accuracy'].startswith('APPROX')]

def is_surveyed(garden):
    return garden['DescripSource'] == 'GrowNYC Community Garden Survey 2009/2010'

def to_dict(garden):
    return {
        'id': { "id" : garden['GARDENID'] },
        'name': garden['Current Name'],
        'description': garden['Fixed Address'],
        'coordinates': '%s, %s' % (garden['Longitude'], garden['Latitude']),
        'surveyed': is_surveyed(garden),
        'borough': garden['Borough'],
        'neighborhood': garden['Neighborhood']
    }

def load_gardens(surveyed):
    for garden in gardens:
        if is_surveyed(garden) == surveyed:
            yield to_dict(garden)

loader = TemplateLoader(['.'])
template = loader.load(sys.argv[1])

surveyed_stream = template.generate(collection=load_gardens(True))
open(sys.argv[3], 'wb').write(surveyed_stream.render().encode('utf8'))

unsurveyed_stream = template.generate(collection=load_gardens(False))
open(sys.argv[4], 'w').write(unsurveyed_stream.render())
