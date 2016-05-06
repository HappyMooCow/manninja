define(['app/value'],function(value){
    function Item(type){
        this.type = type;
        this.values = [];
        this.tags = [];

        var self = this;
        
        for (var i = 0; i < this.type.fields.length; i++) {
            var field = this.type.fields[i];
            this.values.push(new value({
                field: field,
                type: field.type,
                data: undefined,
                reference: undefined
            }));
        }
    }
    
    Item.prototype.name = function(){
        let _out = '',
            _tmp = [];
        for (var i = 0; i < this.type.display.length; i++) {
            _tmp.push(this.type.display[i].localID)
        }

        for (var i = 0; i < this.values.length; i++) {
            if (_tmp.includes(this.values[i].field.localID)) {
                _out += this.values[i].data;
                _out += ' ';
            }
        }

        if(_out === ' ') {_out = 'blank item'}
        return _out;
    }
    
    //Item.prototype.setField =  function(description, value){
    //    for(var i = 0; i< Object.keys(this.fields).length; i++){
    //        if(this.fields[i].description == description){
    //            this.fields[i].value = value;
    //        }
    //    }
    //    Item.events.publish('changed', {
    //        ref: this
    //    })
    //}

    Item.events = (function () {
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

    Item.prototype.is = (function (b) {
        var isEqual = function (a, b) {
            let aProps = Object.getOwnPropertyNames(a),
            bProps = Object.getOwnPropertyNames(b);

            //check length
            if (aProps.length != bProps.length) {
                return false
            }

            //check equality
            for (var i = 0; i < aProps.length; i++) {
                let propName = aProps[i];
                if (typeof a[propName] == 'object') {
                    if (!isEqual(a[propName], b[propName])) { return false }
                }
                else if (a[propName] != b[propName]) { return false }
            }

            //return
            return true
        }

        return isEqual(this, b);
    })

    return Item;
});

