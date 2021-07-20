$(document).ready(function() {
    var map = $('#map').gardenmap({
        addContentToPopup: function(popup, feature) {
            popup.setTemplateURL("garden_details_template.html");
            $.getJSON("resources/json/" + feature.fid + ".json", function(g) {
                popup.processTemplate(g);
            });
        },   
    })
        .data('gardenmap');

    var legend = $('#selectors').legend({
        'map': map,
    })
        .data('legend');

    $('#attribute_picker_container').mapmenu({
        source: 'resources/json/menu.json',
        legend: legend,
    });

    var help = $('#help').help({
        parent_div: $('#map'),
    })
        .data('help');

    if (window.location.href.search('help=no') < 0) {
        $(window).load(function() { // avoid positioning until everything is loaded
            help.show_help();
        });
    }

    $('#close_help_button').button().click(function() {
        help.hide_help();
    });

    $('#map_buttons').mapbuttons({
        $map: $('#map'),
        help: help,
    });

    $('#searchbar').gardensearch({
        map: map,
    });

});

