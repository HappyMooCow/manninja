define(function(){
    /**
     * The Type class
     * 
     * @constructor
     * @param {string} Name - The name of the type
     * @param {Array} Display - Controls which fields are used to in item names
     * @param {Array} Fields - The fields that are used by the type
     */
    function Type(name, display, fields, child){
        this.name = name;
        this.display = display || [];
        this.fields = fields || [];
        this.child = child || false;
    }
    
    /**
     * 
     * @method addField
     * @param {Field} Field - The field to add to Type
     * @param {Bool} Display - Add the new field to the description
     */
    Type.prototype.addField = function(field, disp){
        this.fields.push(field);
        if(disp === true){
            this.display.push(field.description);
        }
    }
    
    return Type;
});