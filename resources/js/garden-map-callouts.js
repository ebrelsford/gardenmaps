function getCallout(index) {
    $.getJSON('resources/json/callout_' + index + '.json', function(callout) {
        $('#callout .content').text(callout.text);
        $('#callout')
            .data('current_callout_index', index)
            .data('ids', callout.ids)
            .data('name', callout.name);
        showCallout(/*10000*/);
    });           
}

function previousCallout() {
    var index = ($('#callout').data('current_callout_index') - 1) % $('#callout').data('num_callouts');
    getCallout(index);
}

function nextCallout() {
    var index = ($('#callout').data('current_callout_index') + 1) % $('#callout').data('num_callouts');
    getCallout(index);
}

function randomCallout() {
    var index = Math.floor(Math.random() * $('#callout').data('num_callouts'));
    getCallout(index);
}

function showCallout(ms) {
    $('#callout').removeClass('minimized');
    if (ms > 0) window.setTimeout(hideCallout, ms);
}

function hideCallout(ms) {
    $('#callout').addClass('minimized');
    if (ms > 0) window.setTimeout(randomCallout, ms);
}

function highlightCalloutGardens() {
    // don't update callout for now?

    // highlight garden ids
    // TODO if ids not present, assume it was an attribute?
    var index = getAvailableSelectorIndicatorIndex();
    selectAttribute($('#callout').data('ids'), $('#callout').data('name'), index);
}

