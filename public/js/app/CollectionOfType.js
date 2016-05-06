define(function(type){
    function cot(){
        this._type = type;
        this._storage = [];
        this._return = [];
    }
    
    cot.prototype.new = function(){
    let _obj = this.Events.onNew(this._type);
    let _index = this._getIndex();
    
    if(_index == this._storage.length()){
        this._storage.push(_obj);
        return;
    }
    
    this._storage[_index] = _obj;
    }
    
    
    cot.prototype.remove = function(object){
    let _index = this._storage.indexOf(object);
    
    if(_index == -1){
        this.Errors.objectDoesNotExist(this, object);
        return
    }
    
    delete this._storage[_index];
    this.Events.onRemove(object);
    }

    cot.prototype._getIndex = function(){
    let _index = this._storage.length();
    if(this._return.length()){
        _index = this._return.pop();
    }
    return _index;
    }

    //------------------------------------------------------------------

    function Events(){return {}}
    cot.prototype.Events = Events();

    Events.prototype.onNew = function(){}

    Events.prototype.onRemove = function(){}

    //------------------------------------------------------------------
    cot.prototype.Errors = {};
    function Errors(){return cot.Errors}

    Errors.prototype.objectDoesNotExist = function(collection, object){
        throw 'The object: ' + object + ' does not exist in ' + collection;
    }
    
    
    
    return cot;

});



