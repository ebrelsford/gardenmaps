// requires:
//
//  libs:
//      jquery
//      jquery-ui
//      jquery-xqs-flyoutMenu
//
//  local:
//      jquery-util
//      legend
//

var MapMenu = {
    init: function(options, elem) {
        this.options = $.extend({}, this.options, options);
        this.legend = this.options.legend;

        this.elem = elem;
        this.$elem = $(elem);
        
        var t = this;
        $.getJSON(this.options.source, function(menuJSON) {
            t.generateMenu(menuJSON);       
        });
    },

    options: {
        source: null,
        legend: null,
    },

    generateMenu: function(menuJSON) {
        var t = this;

        var menuDom = t.makeNestedListFromJSON(menuJSON);
        t.$elem.find('.menu-container').append(menuDom)
            .find('ul:first').attr('id', 'feature_menu')
            .flyoutmenu();

        t.$elem.find('a').click(function(e) {
            t.selectAttribute($(this));
        });
    },

    selectAttribute: function(selected) {
        var t = this;

        var name = selected.data('selectedLabel');
        if (!name) return;

        var id = escape(selected.data('filename'));

        $.getJSON('resources/json/' + id + '.json', function(gardenIds) {
            t.legend.selectAttribute(gardenIds, name);
        });
    },

    makeNestedListFromJSON: function(items) {
        var t = this;
        var list = $('<ul/>');
        $.each(items, function(index, item) {
            var a = $('<a/>');
            if (item.id !== undefined) {
                a.attr('id', item.id);
                a.data('filename', item.id);
            }
            if (item.label !== undefined) a.text(item.label);
            if (item.selectedLabel !== undefined) a.data('selectedLabel', item.selectedLabel);
            a.attr('href', '#');

            var li = $('<li/>').append(a);
            if (!(item.items === undefined)) li.append(t.makeNestedListFromJSON(item.items));
            list.append(li);
        });
        return list;
    },

};

$.plugin('mapmenu', MapMenu);
