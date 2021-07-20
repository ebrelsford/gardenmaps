#!/bin/bash

#
# build the map site
#

TARGET_DIR=build
DATA_FILE=data/db.csv

BIN_DIR=bin
TEMPLATE_DIR=templates
STATIC_RESOURCES_DIR=resources
LIB_DIR=lib
BASE_DIR=.


# build json for details about gardens
echo "Building json, details about gardens"
mkdir -p $TARGET_DIR/resources/json
cd $TARGET_DIR/resources/json
python ../../../$BIN_DIR/csv2json_per_garden.py ../../../$DATA_FILE

# build json for ids of gardens
echo "Building json, ids of gardens (by-attribute)"
python ../../../$BIN_DIR/csv2json_per_attribute.py ../../../$DATA_FILE

# build json for autocomplete
echo "Building json, autocomplete"
python ../../../$BIN_DIR/generate_autocomplete_list.py ../../../$DATA_FILE autocomplete.json

# build kml for all gardens
echo "Building master kml for all gardens"
cd ../../..
mkdir -p $TARGET_DIR/resources/kml
cd $TARGET_DIR/resources/kml
python ../../../$BIN_DIR/csv2kml_all_gardens.py ../../../$TEMPLATE_DIR/template.kml ../../../$DATA_FILE surveyed_gardens.kml unsurveyed_gardens.kml

# build json for menu
echo "Building json for menu"
cd ../json
python ../../../$BIN_DIR/generate_menu_json.py > menu.json

# cp js, css, img
echo "Copying static resources"
cd ../../..
cp -R $BASE_DIR/resources/img $TARGET_DIR/resources
cp -R $BASE_DIR/theme $TARGET_DIR
cp -R $BASE_DIR/resources/css $TARGET_DIR/resources

# minify js
echo "Minifying internal js files"
python $BIN_DIR/minify_js.py $STATIC_RESOURCES_DIR/js internal $TARGET_DIR/resources/internal.js

echo "Minifying lib js files"
python $BIN_DIR/minify_js.py $LIB_DIR lib $TARGET_DIR/resources/lib.js
cp -r $BASE_DIR/lib $TARGET_DIR

# render html
python $BIN_DIR/render_pages.py $TARGET_DIR
rm $TARGET_DIR/layout.html

# cp static html
cp $BASE_DIR/*.html $TARGET_DIR

echo "Successfully built map. Done!"
