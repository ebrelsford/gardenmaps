function makeNestedListFromStructuredObjectJQuery(items) {
    var list = $('<ul/>');
    $.each(items, function(index, item) {
        var li = $('<li/>');
        if (!(item.id === undefined)) li.attr('id', item.id);
        if (!(item.label === undefined)) li.text(item.label);
        if (!(item.selectedLabel === undefined)) li.data('selectedLabel', item.selectedLabel);
        if (!(item.items === undefined)) li.append(makeNestedListFromStructuredObjectJQuery(item.items));
        list.append(li);
    });
    return list;
}

function makeNestedListFromStructuredObject(items) {
    var list = "<ul>";

    for (var i in items) {
        var item = items[i];
        list += "<li>" + item.label;
        if (!(item.items === undefined)) {
            list += makeNestedListFromStructuredObject(item.items);
        }
    }

    list += "</ul>";
    return list;
}

function makeNestedList(menu) {
    var list = "<ul>";
    if (menu instanceof Array) {
        for (var i in menu) {
            list += "<li>" + makeNestedList(menu[i]) + "</li>";
        }
    }
    else if (menu instanceof Object && !(menu instanceof String)) {
        for (var key in menu) {
            if (key === undefined) return "";
            list += "<li>" + makeNestedList(key);
            list += makeNestedList(menu[key]);
            list += "</li>";
        }
    }
    else {
        return menu;
    }
    list += "</ul>";
    return list;
}

