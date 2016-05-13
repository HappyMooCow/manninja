"use strict"
define(['app/class/value', 'app/stdError'],function(value, stdError){
	function item(type, options){
		//constructor
		if (type) {
			var type = type;	
		}
		else {
			stdError.constructorFailed();
			stdError.missingParameter('name');
			return undefined;
		}

		if (options) {
			var values = options.values || new array();
			var tags = options.tags || new array();
		}
		else {
			var values = new array();
			var tags = new array();
		}

        	var self = this;

		createValues(type.fields);

		//methods
		function createValues(fields){
			for(var i=0; i<fields.length; i++){
            			values.push(new value({
		                	field: field,
                			type: fields[i].type,
                			data: undefined,
                			reference: undefined
				}))
			}
		}

		function setValue(field, data){
			for(var i=0; i<values.length; i++){
				if(values[i].field.localID == field.localID){
					values[i].data = data;
				}
			}
		}

		//functions
		function name() {
       			let _out = '',
            		_tmp = [];
        		for (var i = 0; i < this.type.display.length; i++) {
            			_tmp.push(this.type.display[i].localID)
        		}

        		for (var i = 0; i < this.values.length; i++) {
            			if (_tmp.includes(this.values[i].field.localID)) {
                			_out += this.values[i].data;
                			_out += ' ';
            			}
        		}

        		if(_out === ' ') {_out = 'blank item'}
        		return _out;
		}
	
		function is(target){
			var isEqual = function (a, b) {
			    let aProps = Object.getOwnPropertyNames(a),
			    bProps = Object.getOwnPropertyNames(b);

			    //check length
			    if (aProps.length != bProps.length) {
				return false
			    }

			    //check equality
			    for (var i = 0; i < aProps.length; i++) {
				let propName = aProps[i];
				if (typeof a[propName] == 'object') {
				    if (!isEqual(a[propName], b[propName])) { return false }
				}
				else if (a[propName] != b[propName]) { return false }
			    }

			    //return
			    return true
			}

			return isEqual(this, b);
		}

		return {
			//properties
			type: type,
			values: values,
			tags: tags,

			//methods
			setValue: setValue,

			//functions
			is: is,
		}
	}

    return item;
});

