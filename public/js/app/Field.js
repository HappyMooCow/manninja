define(['app/Parser'], function(parser){
    function Field(name, type, filter){
        this.name = name || undefined;
        this.type = type || undefined;
        this.filter = filter || undefined
    }

    Field.parser = parser;

    Field.loadField = function (field) {
        let temp = new Field(
                field.fieldType,
                field.description,
                field.options || '',
                field.value
                );

        return temp;
    }

    Field.loadFieldArray = function (fields) {
        let temp = new Array();
        for (var i = 0; i < fields.length; i++) {
            temp.push(Field.loadField(fields[i]));
        }

        return temp;
    }
    
    return Field;
});



    
