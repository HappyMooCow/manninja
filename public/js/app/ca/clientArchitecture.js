define(['app/LocalID', 'app/Repository', 'app/Type', 'app/Item', 'app/CollectionOfType', 'app/Field', 'app/Form', 'app/Zookeeper', 'app/Parser', 'app/itemForm', 'widgets/newTypeForm', 'widgets/table', 'widgets/Menu', 'widgets/Display', 'widgets/Sidebar', 'app/notifier'], function (LocalID, Repository, Type, Item, collectionOfType, Field, Form, zookeeper, parser, itemForm, ntf, table, menu, display, sidebar, notifier) {
    /**
    * this namespace constructor
    **/  
    window.Architecture = (function () {
        var t = new CA();
        function CA() {
            var localID = new LocalID(),
                items = new Repository(this.events),
                types = new Repository(this.events),
                forms = new Repository(this.events),
                tags = new Repository(this.events),
                keeper = new zookeeper(),
                fields = new Repository(this.events),
                events = this.events,
                notify = new notifier({
			fadeInSpeed: 400,
			fadeOutSpeed: 400,
			displayLength: 1000
		});

            //layout
            var root = $('<div>', { class: 'container-fluid' }).appendTo('body'),                                
                side = $('<div>', { class: 'col-md-1 no-padding' }).appendTo(root),
                main = $('<div>', { class: 'col-md-11' }).appendTo(root);

            // widgets
            //var m = new menu("Manufacture.Ninja", new Array(
            //        new menu.MenuItem('new', new Array(
            //            new menu.MenuItem('Item', typesToMenuItems(getAllTypes()))
            //            //new menu.MenuItem('type',[],CA.newType)
            //        )),
            //        new menu.MenuItem('open', new Array(
            //            new menu.MenuItem('items', typesToMenuItems(CA.getAllTypes))
            //        )),
            //        new menu.MenuItem('Admin', new Array(
            //            new menu.MenuItem('create new type', [], CA.newType)
            //        ))
            //        ));

            var m = new menu('Manufacture.Ninja');
            //initialise menu
            m.addMenuItem(0, new menu.MenuItem('New', []));
            m.addMenuItem(0, new menu.MenuItem('Open', []));
            m.addMenuItem(1, new menu.MenuItem('Open_Items', []));
            m.addMenuItem(2, new menu.MenuItem('Admin', []));
            m.addMenuItem(2, new menu.MenuItem('Settings', []));
            m.addMenuItem(2, new menu.MenuItem('Log Out', []));
            
            m.appendToMenuItem('Admin', new menu.MenuItem('New Type', [], (function () {
                newType();
            })))

            m.render(side); // fix this, don't like separate call


            var d = new display();
            d.place(main);

            var sidemenu = new sidebar();
            //sidemenu.render($(side));


            var loadItem = function (item) {
                let temp = new Item(item.type);
                temp.id = item.id;
                temp.fields = Field.loadFieldArray(item.fields);

                return temp;
            }

            var loadType = function (type) {
                let temp = new Type();
                temp.id = type.id;
                temp.name = type.name;
                temp.display = type.display;
                temp.fields = Field.loadFieldArray(type.fields);

                return temp;
            }

            var getID = this.get;

            this.getAllTags = function () {
                return _Tags.getAll();
            }

            /**
                * event bindings
                *
                **/
            Repository.events.subscribe('new', function (object) {
                _LocalID.requestID(object.object);
                //events.publish('repo', { topic: 'new', caller: object.caller, object: object.object })
            })

            Repository.events.subscribe('remove', function (object) {
                _LocalID.returnID(object.object);
            })

            _Types.myEvents.subscribe('new', function (object) {
                var func = function () {
                    newItem(object);                    
                }
                var func2 = function () {
                    itemTable(object);
                }
                if (!object.child) {
                    m.appendToMenuItem('New', new menu.MenuItemFromType(object, func));
                    m.appendToMenuItem('Open', new menu.MenuItemFromType(object, func2));
                }               
            })

            _Forms.myEvents.subscribe('new', function (object) {
                d.render(object);
                var func = function () {d.render(object)}
                m.appendToMenuItem('Open_Items', new menu.MenuItemFromForm(object, func));

                //sidemenu.addItems(new Array(
                //    new sidebar.Item(
                //    object.title,
                //    func,
                //    object)
                //    ));
            })

            _Forms.myEvents.subscribe('remove', function (object) {
                if ($(d.html()).data('ref').is(object)) {
                    d.clear();
                }
                m.remove(object);
                //sidemenu.removeItem(object);
            })

            //_Forms.Events.onRemove = function(object){
            //    _LocalID.returnID(object);
            //}


            //this._Items.Events.onRemove = function(object){
            //    _LocalID.returnID(object);
            //}           

            //---------------------------------------------------------------------------

            /**
            * CollectionOfType event bindings
            *
            **/

            //            collectionOfType.Events.onNew = function(type){
            //                let _itm = new Item(type);
            //                return this._Items.add(_itm);
            //            }
            //
            //            collectionOfType.Events.onRemove = function(object){
            //                this._Items.remove(object);
            //            }

            //----------------------------------------------------------------------------

            /**
            * this method declarations
            *
            **/

            /**
             * Create a new item
             *
             * @method createItem
             * @param {type} Type The Type of item to create
             **/
            var newItem = function (type) {
                let i = new Item(type);
                let f = new Form('New ' + type.name, new itemForm(i));

                //_Forms.add(f);
            }

            this.removeType = function (object) {
                _Types.remove(object);
            }

            /**
            * @description Create a new type
            * @param {string} Name - Name of the new type
            * @param {array} Display - Fields to display
            * @param {array} Fields - An array of Fields contained within the new type
            * @return {Type} New Type - the newly created type
            */
            var newType = function () {
                let t = new Type('', [], []);
                let f = new Form('New Type', new ntf(t));

                //_Forms.add(f);
            }

            this.openType = function (type) {
                let f = new Form(type.name, new ntf(type))
            }

            var openItem = function (item) {
                let f = new Form(item.name(), new itemForm(item));
            }

            this.getAllTypes = function () {
                return this._Types.getAll();
            }

            this.get = function (ID) {
                return _LocalID.get(ID);
            }

            this.findTypeByParam = function (param, value) {
                return _Types.findByParam(param, value);
            }

            this.getTypesByParam = function (param, value) {
                return _Types.getByParam(param, value);
            }

            this.findItemByParam = function (param, value) {
                return _Items.findByParam(param, value);
            }

            this.findItemByField = function (fieldname, value) {
                for (var i = 0; i < _Items._storage.length; i++) {
                    let itm = _Items._storage[i];
                    for (var x = 0; x < itm.fields.length; x++) {
                        if (itm.fields[x].description == fieldname && itm.fields[x].value == value) {
                            return itm
                        }
                    }
                }
            }

            this.getItemsByTag = function (tag) {
                return this._Items.getByTag(tag);
            }

            this.getTypesByTag = function (tag) {
                return this._Types.getByTag(tag);
            }

            this.getItemsByType = function (type) {
                return _Items.getByParam('type', type);
            }

            //this.newForm = function(item){
            //    let _f = new Form(item);
            //    _Forms.add(_f);
            //    return _f;
            //}

            var itemTable = function (type) {
                return new table(type)
            }

            this.load = function () {
                this._Keeper.loadAll();
            }

            this.field = Field;
            this.form = Form;
            this.type = Type;
            this.item = Item;
            //table event bindings
            var tblEvent = new Array(
                table.events.subscribe('newTable', function (tbl) {
                    let t = new Form('open item', tbl)
                }),
                table.events.subscribe('clicked', function (object) {
                    openItem(object);
                })
                )

            //zookeeper event bindings
            var zkEvent = new Array(
                zookeeper.events.subscribe('gotType', function (type) {
                    notify.showAlert({
                        type: notifier.type.info,
                        text: 'recieved new type: ' + type.name
                    });
                    _Types.add(type);
                    return;
                }),
                zookeeper.events.subscribe('gotItem', function (item) {
                    notify.showAlert({
                        type: notifier.type.info,
                        text: 'received new item: ' + item.name
                    });
                    let e = _LocalID.getByServerID(item.id),
                        t = _LocalID.getByServerID(item.type.id);

                    if (t === null) {
                        item.type = loadType(item.type);
                        _Types.add(item.type);
                    }
                    else {
                        item.type = t;
                    }

                    if (e === null) {
                        let temp = loadItem(item);
                        _Items.add(temp);
                        return
                    }
                    e = item;
                    return
                }),
                zookeeper.events.subscribe('gotField', function (field) {
                    _Fields.add(field);
                    return
                }),
                zookeeper.events.subscribe('gotTag', function (tag) {
                    notify.showAlert({
                        type: notifier.type.info,
                        text: 'got new tag: ' + tag.name
                    });
                    _Tags.add(tag);
                })

                );

            //form event bindings
            var frmEvent = new Array(
                Form.events.subscribe('new', function (frm) {
                    notify.showAlert({
                        type: notifier.type.success,
                        text: 'created new form: ' + frm.title
                    });
                    _Forms.add(frm)
                }),
                Form.events.subscribe('close', function (frm) {
                    _Forms.remove(frm)
                }),
                Form.events.subscribe('submit', function (obj) {
                    if (obj instanceof Type) {
                        if (obj.localID) {
                            let e = _LocalID.get(obj.localID)
                            e = obj;
                        }
                        else { _Types.add(obj) }
                        _Keeper.saveType(obj)
                    }
                    if (obj instanceof Item) {
                        if (obj.localID) {
                            let e = _LocalID.get(obj.localID)
                            e = obj;
                        }
                        else {
                            _Items.add(obj);
                        }
                        _Keeper.saveItem(obj)
                    }
                })
                )

            this.events = (function () {
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

            this.load();

        }

        return t;
    })();
        
    //---------------------------------------------------------------------------
    
    return Architecture;
});








