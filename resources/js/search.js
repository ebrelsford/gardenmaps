

var Search = {

    init: function(options, elem) {
        var t = this;
        this.options = $.extend({}, this.options, options);

        this.elem = elem;
        this.$elem = $(elem);

        this.map = this.options.map;

        var t = this;

        this.$elem.find('#search input[type=text]').example('address or garden name');
        this.$elem.find('#search').keypress(function(e) {
            if (e.keyCode == '13') {
                e.preventDefault();
            }
        });

        $.getJSON('resources/json/autocomplete.json', function(l) {
            t.$elem.find('#address').autocomplete({
                minLength: 0,
                source: l,
                focus: function(event, ui) {
                    t.$elem.find('#address').val(ui.item.label);
                    return false;
                },
                select: function(event, ui) {
                    t.map.selectAndCenterOnGarden(ui.item.fid);
                    return false;
                },
            })
        });
    },

    options: {
        map: null,
    },

};

$.plugin('gardensearch', Search);
