define(['app/Item', 'app/Tag', 'app/Field', 'app/fieldFilter'],function (Item, Tag, Field, fieldFilter) {
    function Zookeeper() {        
        var processGetAll = function (data) {            
            var objs = [],
                dat = data;

            findObj(dat);
            findRef(dat); //replace references

            //save
            for (var i = 0; i < data.items.length; i++) {
                Zookeeper.events.publish('gotItem', data.items[i]);
            }

            for (var i = 0; i < data.types.length; i++) {
                Zookeeper.events.publish('gotType', data.types[i]);
            }

            for (var i = 0; i < data.tags.length; i++) {
                Zookeeper.events.publish('gotTag', data.tags[i]);
            }

            for (var i = 0; i < data.fields.length; i++) {
                Zookeeper.events.publish('gotField', data.fields[i]);
            }

            

            function findRef(obj) {
                let keys = Object.keys(obj);
                for (var i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    try{
                        if (obj[key].hasOwnProperty('$ref')) { //is a reference?
                            obj[key] = replaceRef(obj[key]);
                        }
                        else if (typeof obj[key] == 'object') { //is an object?
                            findRef(obj[key]);
                        }
                    }
                    catch (e) {
                        continue
                    }
                }             
            }

            function findObj(obj) {
                let keys = Object.keys(obj);
                for (var i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    try{
                        if (obj[key].hasOwnProperty('$id')) { //is a reference?
                            objs.push(new Object(obj[key]));
                        }
                        if (typeof obj[key] == 'object') { //is an object?
                            findObj(obj[key]);
                        }
                    }
                    catch (e) {
                        continue
                    }
                }                
            }

            function replaceRef(obj) {
                for (var x = 0; x < objs.length; x++) {
                    let o = objs[x];
                    if (o['$id'] == obj['$ref']) {
                        return objs[x];
                    }
                }
            }

        }

        var processItem = function (item) {
            // save type
            Zookeeper.events.publish('gotType', item.type);

            // save tags
            for (var i = 0; i < item.tags.length; i++) {
                Zookeeper.events.publish('gotTag', item.tags[i])
            }

            return item;
        }

        var processType = function (type) {            
            // save fields
            for (var i = 0; i < type.fields.length; i++) {
                Zookeeper.events.publish('gotField', type.fields[i]);
            }

            for (var i = 0; i < type.display.length; i++) {
                Zookeeper.events.publish('gotField', type.display[i]);
            }

            // save tags
            for (var i = 0; i < type.tags.length; i++) {
                Zookeeper.events.publish('gotTag', type.tags[i]);
            }

            // process fields
            for (var i = 0; i < type.fields.length; i++) {
                processField(type.fields[i]);
            }

            return type
        }

        var processField = function (field) {            
            let t = new fieldFilter();
            field.filter = $.extend(t, field.filter);
            if (typeof field.filter.type != 'undefined' && field.filter.type != null) {
                Zookeeper.events.publish('gotType', field.filter.type);
            }
        }

        var processTag = function(tag){
            return new Tag(tag.name, tag.id)
        }

        var saveDependancies = function (item) {
            let temp = $.extend(true, {}, item),
                sequence = Promise.resolve();

            for (var i = 0; i < temp.fields.length; i++) {
                temp.fields[i].options = String(temp.fields[i].options)
                if (temp.fields[i].value instanceof Item) {
                    let t = temp.fields[i].value,
                        c = i;
                    sequence = sequence.then(function () {
                        return saveDependancy(t)
                    }).then(function (response) {
                        temp.fields[c].value = response
                    })
                }
            }

            sequence = sequence.then(function () {
                saveItem(temp)
            });
        }

        var saveDependancy = function (item) {
            return new Promise(function (resolve, reject) {
                let req = $.ajax({
                    type: "POST",
                    url: '/Server/saveItem',
                    tradititional: true,
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(item),                    
                    success: function (response) {
                        resolve(response)
                    },
                    error: function (reponse) {
                        reject(response)
                    }
                })
                
            })
                
        }

        var saveItem = function (item) {
            return req = $.ajax({
                type: "POST",
                url: '/IO/saveItem',
                tradititional: true,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(item),
                success: function (result) {
                    item.id = result
                    Zookeeper.events.publish('savedItem', item);
                }
            });
        }

        this.saveItem = function (item) {
            //saveDependancies(item);
            saveItem(item);
        }

        this.saveType = function (type) {
            let temp = $.extend(true, {}, type);
            //for (var i = 0; i < temp.fields.length; i++) {
            //    temp.fields[i].options = String(temp.fields[i].options)
            //}


            var req = $.ajax({
                type: "POST",
                url: '/Server/saveType',
                tradititional: true,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(temp),
                success: function (result) {
                    //assign id here
                    type.id = result;
                    Zookeeper.events.publish('savedType', type);
                }
            });
        }

        this.loadAll = function () {
            var req = $.ajax({
                type: "GET",
                url: '/IO/getAll',
                success: function (response) {
                    processGetAll(JSON.parse(response));
                }
            })
                
        }

        this.loadType = function () {

        }
    }


    Zookeeper.events = (function () {
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

    return Zookeeper;
});