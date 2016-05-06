define(function () {
    function value(obj) {
        this.field = obj.field;
        this.type = obj.type;
        this.data = obj.data;
        this.reference = obj.reference;
    }

    return value;
})