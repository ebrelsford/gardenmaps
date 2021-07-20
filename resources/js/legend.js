// requires:
//
//  libs:
//      jquery
//
//  local:
//      map
//

var Legend = {
    init: function(options, elem) {
        this.options = $.extend({}, this.options, options);

        this.elem = elem;
        this.$elem = $(elem);

        this.map = this.options.map;
        this.mapSelectedAttributes = this.options.mapSelectedAttributes;

        var map = this.map;
        var $elem = this.$elem;
        $elem.find('.selector_indicator.active .reset').click(function() {
            var index = $(this).index('.selector_indicator .reset');
            map.clearPicked(index);

            var indicator = $(this).parent('.selector_indicator');
            indicator.find('.label').text('');
            indicator.find('.details').hide();
            indicator.data('attributeDisplayName', '');
            indicator.removeClass('picked');

            $elem.find('#intersection_indicator')
                .hide()
                .find('label').eq(index).text('');
        });

        return this;
    },

    options: {
        // the map that gardens are displayed on
        map: null,

        // the attributes (on the map) that indicate that a garden is selected
        mapSelectedAttributes: [ 'picked0', 'picked1' ],
    },

    selectAttribute: function(garden_ids, attribute_display_name) {
        if (this.isAlreadySelected(attribute_display_name)) return;

        var index = this.getAvailableSelectorIndicatorIndex();

        // highlight gardens with given ids on map
        this.map.addGardenIdsToPicked(garden_ids, index);

        var total = this.map.surveyedGardensLayer.features.length;
        this.$elem.find('.total_gardens').text(total);

        this.populateIndicator(this.$elem.find('.selector_indicator').eq(index), index, garden_ids, total, attribute_display_name);

        this.populateIntersectionIndicator();
    },

    populateIntersectionIndicator: function() {
        if (this.$elem.find('.selector_indicator.active .label:empty').length != 0) {
            this.$elem.find('#intersection_indicator').hide();
            return;
        }

        var attr = this.mapSelectedAttributes;
        var intersect = $.grep(this.map.surveyedGardensLayer.features, function(feature) {
            return feature.attributes[attr[0]] && feature.attributes[attr[1]];
        }).length;
        var total = this.map.surveyedGardensLayer.features.length;
        var intersect_percentage = (intersect / total * 100).toPrecision(3);

        var intersectionIndicator = this.$elem.find('#intersection_indicator');
        intersectionIndicator.find('.details .selected_gardens').text(intersect);
        intersectionIndicator.find('.details .percentage').text(intersect_percentage);
        intersectionIndicator.find('.details').show();
        intersectionIndicator.show();
    },

    populateIndicator: function(indicator, index, selectedIds, totalGardens, attributeDisplayName) {
        var selected = selectedIds.length;
        var percentage = (selected / totalGardens * 100).toPrecision(3);

        indicator.find('.selected_gardens').text(selected);
        indicator.find('.percentage').text(percentage);
        indicator.find('.label').text(attributeDisplayName);
        indicator.find('.details').show();
        indicator.data('attributeDisplayName', attributeDisplayName);

        this.$elem.find('#intersection_indicator .label').eq(index).text(attributeDisplayName);
    },

    isAlreadySelected: function(attributeDisplayName) {
        var matches = this.$elem.find('.selector_indicator').filter(function(i) {
            return $(this).data('attributeDisplayName') == attributeDisplayName;
        });
        return matches.length > 0;
    },

    getAvailableSelectorIndicatorIndex: function() {
        var index = this.$elem.find('.selector_indicator.active.picked').index();
        if (index >= 0) return index;

        index = 0;

        var max_index = this.$elem.find('.selector_indicator.active').size() - 1;
        while (index <= max_index) {
            if (this.$elem.find('.selector_indicator.active .label').eq(index).text() == '') break;
            index++;
        }

        return index > max_index ? max_index : index;
    },
};

$.plugin('legend', Legend);
