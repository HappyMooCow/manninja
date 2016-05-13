define(function(){
    /**
     * The LocalID Class
     *
     * @class LocalID
     * @constructor
     * @static
     */
    function LocalID(){
        this.returnedID = [];
        this.storage = [];
    }    
    
    
    /**
     * Assigns the next available local UID to the object
     *
     * @method requestID
     * @param {Object} object The object to assign an ID to
     */
    LocalID.prototype.requestID = function(object) {
        let _id = this._getID();
        while(this._assign(_id, object) == false){
            _id = this._getID();
        }
        object.localID = _id;
    }

    /**
     * Returns local UID assigned to the object to the available pool
     *
     * @method returnID
     * @param {object} Target - The object to remove an ID from
     */
    LocalID.prototype.returnID = function(object){
        if(this._unassign(object.localID)){
            return true;
        }
        return false;
    }

    /**
     * Returns a reference to the object assigned to an ID
     *
     * @method get
     * @param {number} ID the ID of the object to return
     * @returns {object} object reference belonging to ID or undefined
     */
    LocalID.prototype.get = function(ID){
        if(ID >= this.storage.length){
            this.error.IDhasNotBeenAssigned(ID);
            return undefined;
        }

        if(typeof this.storage[ID] == undefined){
            this.error.objectDoesNotExist(ID);
            return undefined;
        }

        return this.storage[ID];
    }

    /**
     * Returns the next available ID
     * 
     * @method _getID
     * @returns {number} the ID to be assigned
     */
    LocalID.prototype._getID = function(){
       if(this.returnedID.length){
           return this.returnedID.pop();
       }

        return this.storage.length;
    }

    /**
     * Deletes the object reference assigned to the targeted ID
     *
     * @method _unassign
     * @param {number} ID The ID to unassign
     * @return {boolean} true if successful, false otherwise
     */
    LocalID.prototype._unassign = function(ID){
        delete this.storage[ID];

        if (typeof this.storage[ID] != 'undefined'){
            this.error.deletionNotSuccessful(ID);
            return false;
        }
        this.returnedID.push(ID);
        return true
    }

    /**
     * Assigns an object reference to the targeted ID
     *
     * @method _assign
     * @param {number} ID The ID to assign
     * @returns {boolean} true if successful, false otherwise
     */
    LocalID.prototype._assign = function(ID, object){
        if(typeof this.storage[ID] != 'undefined'){
            this.error.IDisAssigned(ID);
            return false;
        }

        if(ID > this.storage.length){
            this.error.IDisOutOfRange(ID)
            return false;
        }

        if(ID == this.storage.length){
            this.storage.push(object);
            return true;
        }

        this.storage[ID] = object;
        return true; 
    }

    LocalID.prototype.getByServerID = function (id) {
        for (var i = 0; i < this.storage.length; i++) {
            let t = this.storage[i];
            try {
                if (t.id == id) { return t }
            }
            catch (e) {

            }
        }
        return undefined;
    }
    //-----------------------------------------------------------------------------
    /**
     * The LocalIDError Class
     *
     * @class LocalIDError
     * @constructor
     * @static
     */
    function LocalIDError(){

    }
    LocalID.prototype.error = LocalIDError;

    LocalIDError.IDisAssigned = function(ID){
        throw 'Attempted to overwrite ID #' + ID + ', which has already been assigned an object reference';
    }

    LocalIDError.IDisOutOfRange = function(ID){
        throw 'Attempted to assign ID #' + ID + ', which is out of range';
    }

    LocalIDError.deletionNotSuccessful = function(ID){
        throw 'The object referenced by ID #' + ID + ' was not successfully deleted';
    }

    LocalIDError.objectDoesNotExist = function(ID){
        throw 'The requested ID #' + ID + ' does not contain an object reference';
    }

    LocalIDError.IDhasNotBeenAssigned = function(ID){
        throw 'The requested ID #' + ID + ' has not been assigned'
    }

    
    return LocalID;
});




