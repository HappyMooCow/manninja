define(['app/Field', 'widgets/collection', 'widgets/selectField', 'widgets/textField', 'widgets/itemField'],function(Field, collection, selectField, textField, itemField){
    function itemForm(Item){        
        var fields = [];
        var item = Item;
        var main = $('<div>', { class: 'form' }).data('ref', Item),
            title = $('<h1>', {class: 'title'}).appendTo($(main)),
            header = $('<div>', {class: 'header'}).appendTo($(main)),
            body = $('<div>', {class: 'body'}).appendTo($(main)),
            footer = $('<div>', {class: 'footer'}).appendTo($(main));                    

        var newTextField = function (value) {
            let f = new textField(item.values[i]);
            fields.push(f);
            body.append(f.html());
        }

        var newSelectField = function (value) {
            let f = new selectField(item.values[i]);
            fields.push(f);
            body.append(f.html());
        }

        var newCollectionField = function (value) {
            let f = new collection(value.field.name, value.field.filter.type);
            fields.push(f);
            body.append(f.html());
        }

        var newitemField = function (value) {
            let f = new itemField([], Architecture.getTypesByTag(value.field.filter.tag));
            fields.push(f);
            body.append(f.html());
        }
                

        for (var i = 0; i < item.values.length; i++) {
            switch (item.values[i].field.type) {
                case 'text':
                    newTextField(item.values[i]);
                    break;
                case 'select':
                    newSelectField(item.values[i]);
                    break;
                case 'collection':
                    newCollectionField(item.values[i]);
                    break;
                case 'item':
                    newitemField(item.values[i]);
                    break;
            }
        }

        ////load values
        for (var i = 0; i < fields.length; i++) {
            for (var x = 0; x < item.values.length; x++) {
                if (item.values[x].field.localID == fields[i].field().localID) {
                    if (typeof item.values[x].reference != 'undefined' && item.values[x].reference != null) {
                        fields[i].val(item.values[x].reference);
                    }
                    else {
                        fields[i].val(item.values[x].data);
                    }

                }
            }
        }
        
        this.submit = function () {
            let itm = item;
            for (var i = 0; i < fields.length; i++) {
                let t = fields[i].submit(),
                    f = t.field,
                    v = t.value;
                for (var x = 0; x < itm.values.length ; x++) {
                    if (itm.values[x].field.localID == f.localID) {
                        switch (typeof v) {
                            case 'string':
                                itm.values[x].data = v
                                break;
                            case 'object':
                                itm.values[x].reference = v
                                break;
                        }                       
                    }
                }
            }
            return itm
        }

        this.html = function () {
            return main
        }

        
    } 
    
    itemForm.prototype.save = function(){
        let _in = $('.input', body);
        
        _in.each(function(){
           $(this).data('field').value = $(this).val();
        });

        Form.events.publish('changed', this)
    }

    itemForm.events = (function () {
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
    
    return itemForm;
});