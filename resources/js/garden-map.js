var surveyedGardensLayer;
var unsurveyedGardensLayer;
var selectControl;

// these define what selected gardens will look like. currently: first, second, first + second

var defaultStyle = {
    pointRadius: '5',
    fillColor: '#3f9438',
    fillOpacity: '0.4',
    strokeOpacity: '0.8',
    strokeWidth: 0,
};

var styles = [{ pointRadius: '6', fillColor: '#f9ff51', fillOpacity: '0.6' },
              { pointRadius: '6', fillColor: '#f90000', fillOpacity: '0.4' },
              { pointRadius: '8', fillColor: '#E8C051', fillOpacity: '0.8' }
             ];

var unsurveyedStyle = { pointRadius: '2', fillColor: '#0000FF', fillOpacity: '0.5', strokeWidth: 0 };

var createBBox = function(lon1, lat1, lon2, lat2) {
    var epsg4326 = new OpenLayers.Projection("EPSG:4326");
    var mapProj = new OpenLayers.Projection("EPSG:900913");

    var b = new OpenLayers.Bounds();
    b.extend(new OpenLayers.LonLat(lon1, lat1).transform(epsg4326, mapProj));
    b.extend(new OpenLayers.LonLat(lon2, lat2).transform(epsg4326, mapProj));
    return b;
};

function createDefaultMap(){
    var map = new OpenLayers.Map('map', {
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.LoadingPanel(),
            new OpenLayers.Control.ZoomPanel()
        ],
        restrictedExtent: createBBox(-75.066, 41.526, -72.746, 39.953),
        zoomToMaxExtent: function() {
            this.setCenter(new OpenLayers.LonLat(-8230729.8555054, 4970948.0494563), 10);
        }
    });

    var cloudmade = new OpenLayers.Layer.CloudMade("CloudMade", {
        key: '781b27aa166a49e1a398cd9b38a81cdf',
        styleId: '17595',
        transitionEffect: 'resize'
    });
    map.addLayer(cloudmade);

    var epsg4326 = new OpenLayers.Projection("EPSG:4326");

    var center = new OpenLayers.LonLat(-8230729.8555054, 4970948.0494563);
    map.setCenter(center, 10);

    /* add the base garden layer */
    surveyedGardensLayer = addSurveyedGardens(map);
    unsurveyedGardensLayer = addUnsurveyedGardens(map);

    addControls(map, [surveyedGardensLayer, unsurveyedGardensLayer]);

    return map;
}

function addSurveyedGardens(map) {
    var layer = getLayer(map, 'surveyed_gardens', defaultStyle);
    addStyles(layer);
    return layer;
}

function addUnsurveyedGardens(map) {
    return getLayer(map, 'unsurveyed_gardens', unsurveyedStyle);
}

function getLayer(map, name, style) {
    var layer = new OpenLayers.Layer.Vector(name, {
        projection: map.displayProjection,
        strategies: [new OpenLayers.Strategy.Fixed()],
        styleMap: getStyles(style),
        protocol: new OpenLayers.Protocol.HTTP({
            url: "resources/kml/" + name + ".kml",
            format: new OpenLayers.Format.KML()
        })
    });
    map.addLayer(layer);
    return layer;
}

function clearPicked(index) {
    var attr = "picked" + index;
    $.each(surveyedGardensLayer.features, function(i, feature) {
        feature.attributes[attr] = false;
    });
    surveyedGardensLayer.redraw();
}

function addGardenIdsToPicked(gardenIds, index) {
    clearPicked(index);

    var attr = "picked" + index;
    $.each(surveyedGardensLayer.features, function(i, feature) {
        if ($.inArray(parseInt(feature.fid), gardenIds) >= 0) {
            feature.attributes[attr] = true;
        }
    });
    surveyedGardensLayer.redraw();
}

function addStyles(layer) {
    var filter1 = new OpenLayers.Filter.Comparison({
        type: OpenLayers.Filter.Comparison.EQUAL_TO,
        property: "picked0",
        value: true
    });
    var filter2 = new OpenLayers.Filter.Comparison({
        type: OpenLayers.Filter.Comparison.EQUAL_TO,
        property: "picked1",
        value: true
    });

    var rulePicked = [];
    rulePicked[0] = new OpenLayers.Rule({
        filter: filter1,
        symbolizer: styles[0]
    });
    rulePicked[1] = new OpenLayers.Rule({
        filter: filter2,
        symbolizer: styles[1]
    });
    rulePicked[2] = new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.AND,
            filters: [ filter1, filter2 ]
        }),
        symbolizer: styles[2]
    });
    rulePicked[3] = new OpenLayers.Rule({
        elseFilter: true
    });
    layer.styleMap.styles['default'].addRules(rulePicked);
}

function getStyles(style) {
    return new OpenLayers.StyleMap({'default': style, 'select': {pointRadius: 15}, 'temporary': {pointRadius: 10}});
}

function addControls(map, layers) {
    getControlHoverFeature(map, layers)
    selectControl = getControlSelectFeature(map, layers)
}

function getControlSelectFeature(map, layers) {
    var selectControl = new OpenLayers.Control.SelectFeature(layers);

    $.each(layers, function(i, layer) {
        layer.events.on({
            "featureselected": onFeatureSelect,
            "featureunselected": onFeatureUnselect
        });
    });

    map.addControl(selectControl);
    selectControl.activate();   
    return selectControl;
}

function getControlHoverFeature(map, layers) {
    var selectControl = new OpenLayers.Control.SelectFeature(layers, {
        hover: true,
        highlightOnly: true,
        renderIntent: 'temporary'
    });
    map.addControl(selectControl);
    selectControl.activate();   
    return selectControl;
}


/*
 * More generic layer showing/hiding/loading
 */

function hideLayer(map, name) {
    var layers = map.getLayersByName(name);
    if (layers.length == 0) return;
    layers[0].setVisibility(false);
}

function showLayer(map, name) {
    var layers = map.getLayersByName(name);
    if (layers.length == 0) {
        loadLayer(map, name);
    }
    else {
        layers[0].setVisibility(true);
    }
}

var layerUrls = {
    'City Councils': "resources/geojson/nycc.geojson",
    'City Council Labels': "resources/geojson/nycc_centroids.geojson",
    'Community Districts': "resources/geojson/nycd.geojson",
    'Community District Labels': "resources/geojson/nycd_centroids.geojson",
    'Boroughs': "resources/geojson/boroughs.geojson",
    'Borough Labels': "resources/geojson/borough_centroids.geojson",
};

function loadLayer(map, name) {
    var layer = new OpenLayers.Layer.Vector(name, {
        projection: map.displayProjection,
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: layerUrls[name],
            format: new OpenLayers.Format.GeoJSON(),
        }),
        styleMap: new OpenLayers.StyleMap({
            'default': {
                'strokeWidth': 1,
                'strokeColor': '#000',
                'fillOpacity': 0,
            },
        }),
    });
    map.addLayer(layer);
}

function hideLabelLayer(map, name) {
    var layers = map.getLayersByName(name);
    if (layers.length == 0) return;
    layers[0].setVisibility(false);
}

function showLabelLayer(map, name) {
    var layers = map.getLayersByName(name);
    if (layers.length == 0) {
        loadLabelLayer(map, name);
    }
    else {
        layers[0].setVisibility(true);
    }
}

function loadLabelLayer(map, name) {
    var layer = new OpenLayers.Layer.Vector(name, {
        projection: map.displayProjection,
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: layerUrls[name],
            format: new OpenLayers.Format.GeoJSON(),
        }),
        styleMap: new OpenLayers.StyleMap({
            'default': {
                'label': '${label}',
            },
        }),
    });
    map.addLayer(layer);
}
