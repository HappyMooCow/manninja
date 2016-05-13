'use strict'
define(function () {
    function Sidebar(items) {
        //private variables
        var DOM,
            self = this,
            items = [];

        //private methods
        function createElements() {
            let base = $('<div>', { class: 'container-fluid sidemenu' }),
                list = $('<ul>', { style: 'list-style-type:none' }).appendTo(base);

            return base;
        }

        function createItems(input) {
            input.forEach(function (item) {
                items.push(item)
                $('ul', DOM).append(item.DOM);
            });
        }

        function findByRef(ref) {
            for (var i = 0; i < items.length; i++) {
                let item = items[i];
                if (ref.is(item.ref)) { return item }
            }
        }
        
        //constructor
        DOM = createElements();
        if (items) { createItems(items) }

        $('li', DOM).click(function () {
            self.events.publish('click', {
                target: this
            })
        })

        //priveleged methods
        this.addItems = function (items) {
            if (items) { createItems(items) }
        }

        this.render = function (target) {
            DOM.appendTo(target);
        }

        this.remove = function () {
            DOM.detach();
        }

        this.removeItem = function (item) {
            let itm = findByRef(item);
            $(itm.DOM).remove();
            itm = null;
        }

        this.update = function (ref) {
            let itm = findByRef(ref);
            itm.render();
            let ss = '#' + itm.id
            $(ss, DOM).html($('a', itm.DOM));
        }
    }

    //public methods
    Sidebar.prototype.events = (function () {
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


    //static methods
    Sidebar.Item = function sidebarItem(iname, func, ref) {
        var name = iname,
            path = func;
       
        this.ref = ref;
        this.id = (Sidebar.UID());
        
        this.render = function () {
            this.DOM = $('<li>', {
                id: this.id,
                html: $('<a>', { text: iname, href: '#' }).click(func)
            });
        }

        //constructor
        this.render();
    
    }
    Sidebar.UID = (function() {
        if (typeof this.nextID === 'undefined') {
            this.nextID = 0
        }
        this.nextID += 1;
        return this.nextID;
    });

    return Sidebar


});