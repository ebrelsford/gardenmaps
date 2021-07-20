#!/usr/bin/python

import os
import sys

from jsmin import jsmin

def minify(in_dir, in_files, out_file):
    js = ';'.join([open(os.sep.join([in_dir, in_file]), 'r').read() for in_file in in_files])
    out_file.write(jsmin(js))

if __name__ == '__main__':
    files = {
        'internal': [
            'jquery-util.js',
            'map.js',
            'legend.js',
            'mapmenu.js',
            'help.js',
            'jquery.smartresize.js',
            'map-buttons.js',
            'search.js',
            'callouts.js',
            'main.js',
        ],
        'lib': [
            'OpenLayers.js',
            'cloudmade.js',
            'jquery-ui-1.9m3.min.js',
            'jquery-jtemplates.js',
            'jquery.example.min.js',
        ],
    }
    minify(sys.argv[1], files[sys.argv[2]], open(sys.argv[3], 'w'))
