define(['app/Item', 'app/itemForm'], function (Item, ItemForm) {
    function itemField(items, options) {
        var base = $('<div>', { class: 'panel panel default' }),
            heading = $('<div>', { class: 'panel-heading' }).appendTo(base),
            title = $('<h1>').appendTo(heading),
            body = $('<div>', { class: 'panel-body' }).appendTo(base),
            group = $('<div>', { class: 'panel-group' }).appendTo(body),
            footer = $('<div>', {class: 'panel-footer'}).appendTo(base),
            forms = [];

        //add items
        for (var i = 0; i < items.length; i++) {
            addItem(items[i]);
        }

        //add controls
        var btn = $('<button>', { class: 'btn btn-default', text: 'add' }),
            select = $('<select>');

        while (options.length > 0) {
            var t = options.shift();

            if (typeof t != 'undefined') {
                $('<option>', { text: t.name }).data('ref', t).appendTo(select);
            }
        }

        //add event bindings
        btn.click(function () {
            var t = (':selected', select).data('ref'),
                i = new Item(t);
            addItem(i);
        })

        var addItem = function (item) {
            var t = $('<div>', { class: 'panel panel-default' }),
                h = $('<div>', { class: 'panel-heading' }).appendTo(t),
                b = $('<div>', { class: 'panel-body' }).appendTo(t);

            $('<h1>', { text: item.name() }).appendTo(h);
            var frm = new ItemForm(item);
            forms.push(frm);
            b.append(frm.html());
        }

        var submit = function () {
            var out = [];
            for (var i = 0; i < forms.length; i++) {
                out.push(forms[i].submit())
            }
            return out;
        }


        this.html = function () {
            return base
        }
    }

    return itemField
})