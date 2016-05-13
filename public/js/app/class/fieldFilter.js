define(function () {
    function fieldFilter(type, object) {
        var filterType = type || undefined,
            list = undefined,
            type = undefined,
            tag = undefined,
            self = this;


        if (typeof object === 'object') {
            if (object.list) {
                list = object.list
            }

            if (object.type) {
                type = object.type
            }

            if (object.tag) {
                list = object.tag
            }
        }      
        
        var filterFunction = undefined;

        var generateFilterFunction = function () {
            switch (self.filterType) {
                case 'list':
                    return (function () {
                        let f = function () {
                            return list
                        }
                        return f
                    })();
                    break;
                case 'type':
                    return (function () {
                        let f = function () {
                            return Architecture.getItemsByType(self.type);
                        }
                        return f
                    })();
                    break;
                case 'itemByTag':
                    return (function () {
                        let f = function () {
                            return Architecture.getItemsByTag(tag);
                        }
                        return f
                    })();
                    break;                                                                
                case 'typeByTag':
                    return (function () {
                        let f = function () {
                            return Architecture.getTypesByTag(tag);
                        }
                    })();
                    break;
            }
        }

        this.getOptions = function () {
            if (typeof filterFunction === 'undefined') {
                filterFunction = generateFilterFunction();
            }

            return filterFunction();
        };
    }



    return fieldFilter;
})