// requires
//
//  libs:
//      jquery
//

var Help = {
    init: function(options, elem) {
        this.options = $.extend({}, this.options, options);

        this.elem = elem;
        this.$elem = $(elem);

        this.parent_div = this.options.parent_div;

        var z = this.$elem.css('z-index');
        this.modal = this.$elem.before('<div/>').prev()
            .css({ 'z-index': z - 1 })
            .addClass('helpmodal');

        this.positioned = false;

        return this;
    },

    options: {
        parent_div: null,
    },

    hide_help: function() {
        this.$elem.hide();
        this.modal.hide();
    },

    position: function() {
        if (this.positioned) return;
        this.positioned = true;

        var pWidth = this.parent_div.width();
        var pHeight = this.parent_div.height();

        this.modal
            .width(pWidth)
            .height(pHeight)
            .position({
                my: 'left top',
                at: 'left top',
                of: this.parent_div
            });

        this.$elem
            .width(pWidth - 100)
            .height(pHeight - 100)
            .position({
                my: 'left top',
                at: 'left top',
                of: this.parent_div,
                offset: '30',
            });
    },

    show_help: function() {
        this.position();
        this.modal.fadeTo('fast', .5);
        this.$elem.fadeTo('fast', .7);
    },

};

$.plugin('help', Help);
