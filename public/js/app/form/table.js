define(function () {
    function table(type) {
        var root = $('<div>')
        base = $('<table>', { class: 'table table-condensed table-hover' }).appendTo(root),
        head = $('<thead>').appendTo(base),
        body = $('<tbody>').appendTo(base),
        footer = $('<div>').appendTo(root);

        let hr = $('<tr>').appendTo(head);
        for (var i = 0; i < type.fields.length; i++) {
            $('<th>', {text: type.fields[i].name}).appendTo(hr)
        }

        let items = Architecture.getItemsByType(type);
        for (var i = 0; i < items.length; i++) {
            let itm = items[i],
                br = $('<tr>').data('ref', itm).appendTo(body);

            br.click(function () {
                table.events.publish('clicked', br.data('ref'))
            });
                
            for (var x = 0; x < itm.values.length; x++) {
                var t = $('<td>').appendTo(br)
                if (typeof itm.values[x].reference == 'undefined' || typeof itm.values[x].reference == null) {
                    t.append(itm.values[x].string);
                }
                else {
                    t.append($('<a>', { text: itm.values[x].reference.name() }));
                }
            }
        }

        
        this.submit = function () { }
        this.html = function () { return root }

        table.events.publish('newTable', this);
    }

    table.events = (function () {
        var topics = {},
            hOP = topics.hasOwnProperty;

        return {
            subscribe: function (topic, listener) {
                //create topic object if not created
                if (!hOP.call(topics, topic)) topics[topic] = [];

                //add listener to queue
                var index = topics[topic].push(listener) - 1;

                //provide handle for removal of topic
                return {
                    remove: function () {
                        delete topics[topic][index];
                    }
                };
            },

            publish: function (topic, info) {
                //check if the topic exists
                if (!hOP.call(topics, topic)) return;

                //fire topic
                topics[topic].forEach(function (item) {
                    item(info != undefined ? info : {});
                });
            }
        }
    })();

    return table
})