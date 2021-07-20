#!/usr/bin/python

#
# generate json that feeds the search autocomplete
#

import sys, csv, json

def autocomplete(g):
    return {
        'label': g['Current Name'],
        'fid': g['GARDENID'],
    }

gardens = csv.DictReader(open(sys.argv[1], 'rU'), dialect='excel')
gardens = [g for g in gardens if not g['Geocode Accuracy'].startswith('APPROX')] # XXX still need this?
gardens = sorted(gardens, key=lambda g: g['Current Name'])

autocompletes = [autocomplete(g) for g in gardens]

open(sys.argv[2], 'w').write(json.dumps(autocompletes))
