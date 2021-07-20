

var Callouts = {

    init: function(options, elem) {
        var t = this;
        this.options = $.extend({}, this.options, options);

        this.elem = elem;
        this.$elem = $(elem);

        this.legend = this.options.legend;
        this.interval = this.options.interval;

        this.$elem.data('num_callouts', 2);
        this.$elem.find('.content').click(this.highlightCalloutGardens);
        this.$elem.find('#actions #show').click(this.highlightCalloutGardens);
        this.$elem.find('#actions #previous').click(this.previousCallout);
        this.$elem.find('#actions #next').click(this.nextCallout);
        this.$elem.find('#actions #minimize').click(this.hideCallout);
        this.$elem.find('#minimized #maximize').click(this.showCallout);
    },

    options: {
        legend: null,
        interval: 0,
    },

    getCallout: function(index) {
        var t = this;
        $.getJSON('resources/json/callout_' + index + '.json', function(callout) {
            t.$elem.find('.content').text(callout.text);
            t.$elem
                .data('current_callout_index', index)
                .data('ids', callout.ids)
                .data('name', callout.name);
            t.showCallout(t.interval);
        });           
    },

    previousCallout: function() {
        var index = (this.$elem.data('current_callout_index') - 1) % this.$elem.data('num_callouts');
        this.getCallout(index);
    },

    nextCallout: function() {
        var index = (this.$elem.data('current_callout_index') + 1) % this.$elem.data('num_callouts');
        this.getCallout(index);
    },

    randomCallout: function() {
        var index = Math.floor(Math.random() * this.$elem.data('num_callouts'));
        this.getCallout(index);
    },

    showCallout: function(ms) {
        this.$elem.removeClass('minimized');
        if (ms > 0) window.setTimeout(this.hideCallout, ms);
    },

    hideCallout: function(ms) {
        this.$elem.addClass('minimized');
        if (ms > 0) window.setTimeout(this.randomCallout, ms);
    },

    highlightCalloutGardens: function() {
        // don't update callout for now?

        // highlight garden ids
        // TODO if ids not present, assume it was an attribute?
        legend.selectAttribute(this.$elem.data('ids'), this.$elem.data('name'));
    },

};

$.plugin('callouts', Callouts);
