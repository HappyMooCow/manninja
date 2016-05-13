define(function () {
    function collection(title, item) {
        this.items = [];
        this.item = item;
        var root = $('<div>', {
            class: 'panel panel-default'
            }),
            heading = $('<div>', {
                class: 'panel-heading'
            }).appendTo(root),
            body = $('<div>', {
                class: 'panel-body'
            }).appendTo(root),
            footer = $('<div>', {
                class: 'panel-footer'
            }).appendTo(root);

        heading.append($('<h5>', { text: title }));
        footer.append($('<button>', {
            class: 'btn btn-primary',
            type: 'button',
            text: 'add'            
        }).data('parent', this).click(function () { $(this).data('parent').add() }))

        this.add = function (i) {
            let t = new this.item(i);
            let o = $('<div>', { class: 'panel panel-default' })
                .append($('<div>', { class: 'panel-body' })
                .append(t.html()))
            body.append(o);
            this.items.push(t)
        }

        this.submit = function () {
            let o = [];
            for (var i = 0; i < this.items.length; i++) {
                o.push(this.items[i].submit());
            }
            return o
        }

        this.html = function () {
            return root;
        }

        this.field = function () {
            return this.item.field;
        }
    }

    return collection
})