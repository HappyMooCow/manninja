define(function(){
    function Repository(eventHandler) {
        this.eventHandler = eventHandler;
        this._storage = [];
        this._returned = [];

        var _storage = this._storage,
            _returned = this._returned,
            _events = this.Events,
            self = this;



        var exists = function (object) {                        
            for (var i = 0; i < _storage.length - _returned.length; i++) {
                if (typeof _storage[i] != 'undefined') {
                    if (_storage[i].id == object.id && typeof _storage[i].id != 'undefined') {
                        return i;
                    }
                }                
            }
            return -1;
        }

        var update = function (object, index) {
            $.extend(_storage[index], object);
            self.myEvents.publish('update', object);
            Repository.events.publish('update', { object: object, caller: self });
        }

        var addNew = function (object) {
            let _id =_storage.length;
            if (!_returned) {
                _id = _returned.pop();
            }

            if (_id = _storage.length) {
                _storage.push(object);
            }
            else { _storage[_id] = object }

            if (checkObject(_id, object)) {                                
                self.myEvents.publish('new', object);
                Repository.events.publish('new', { object: object, caller: self });
                return object;
            }

            this.Errors.addNotSuccessful(_id, object);
        }

        var assimilate = function (object, index) {
            $.extend(object, _storage[index]);
        }

        this.add = function (object) {
            var index = exists(object);
            if (index > -1 && typeof object.localID == 'undefined') {
                assimilate(object, index);
                return
            }
            if (!index) {
                update(object, index);                
            }
            else {
                addNew(object)                
            }            
        }

        this.remove = function (object) {
            for (var i = 0; i < this._storage.length; i++) {
                if (JSON.stringify(object) === JSON.stringify(_storage[i])) {
                    delete _storage[i];
                    _returned.push(i);
                    self.myEvents.publish('remove', object);
                    Repository.events.publish('remove', {object: object, caller: self})
                    return;
                }
            }

            //this.Errors.objectNotFound(object);
        }

        var checkObject = function (index, object) {
            if (JSON.stringify(object) === JSON.stringify(_storage[index])) {
                return true;
            }
            return false;
        }

        this.myEvents = (function () {
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
    }            

    Repository.prototype.new = function(object){
        this.Events.onNew(object);
    }

    Repository.prototype.findByParam = function(parameter, value){
        for(var i = 0; i < this._storage.length; i++){
            let _index = Object.keys(this._storage[i]).indexOf(parameter);

            if(_index != -1){
                if(Object.keys(this._storage[i])[_index]){
                    return this._storage[i];
                }
            }
        }
        this.Error.objectNotFound(undefined);
    }

    Repository.prototype.findByParam = function(param, value){
        for(var i=0; i<this._storage.length; i++){
            let _itm = this._storage[i];
            
            if(_itm[param] === value){
               return _itm;
            }
        }
    }
    
    Repository.prototype.getByParam = function(parameter, value){
        let _out = []
        for(var i=0; i<this._storage.length; i++){
            let _itm = this._storage[i];
            
            if(_itm[parameter] === value || _itm[parameter].localID == value.localID){
                _out.push(_itm);
            }
        }
        return _out;
    }

    Repository.prototype.getAll = function () {
        let out = []
        for (var i = 0; i < this._storage.length; i++) {
            out.push(this._storage[i])
        }
        return out;
    }

    Repository.prototype.getByTag = function (tag) {
        var o = [];
        for (var i = 0; i < this._storage.length; i++) {
            var x = this._storage[i];
            if (x.tags.includes(tag)) {
                o.push(x);
            }
            return o;
        }
    }


    //------------------------------------------------------ static events
    Repository.events = (function () {
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


    //------------------------------------------------------
    function RepositoryErrors(){return {}}
    Repository.prototype.Errors = RepositoryErrors();

    RepositoryErrors.prototype.objectNotFound = function(object){
        throw 'The object: ' + object + ' was not found in repository.';
    }

    RepositoryErrors.prototype.addNotSuccessful = function(object){

    }
    
    return Repository;
});
