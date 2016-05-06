define(function () {
    function Parser() {

    }

    Parser.parse = function (i) {
        let f = function(){}
        switch (i.substring(0, 1)) {
            case '@':
                (function () {
                    f = function () {
                        let t = CA.findTypeByParam("name", i.substring(1));
                        let itm = CA.getItemsByType(t);
                        return itm
                    }                    
                })()                
            case '#':
                (function () {
                    f = function () {
                        let t = CA.getTypesByParam("tag", i.substring(1));
                        return t
                    }
                })();
                
                return f;
        }
    }

    return Parser;
});