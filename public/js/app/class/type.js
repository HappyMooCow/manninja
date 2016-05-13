define(['app/stdError'], function(stdError){
    function type(options){
	//constructor
	var defaults = {
		name: 'no_name',
		display: new array(),
		fields: new array(),
		child: false
	}
	if(options){
		var name = options.name || defaults.name;
		var display = options.display || defaults.display;
		var fields = options.fields || defaults.fields;
		var child = options.child || defaults.child;
	}
	else {
		stdError.missingParameter('options');
		return undefined;
	}

	//methods
	function addField(options){
		if(options){
			this.fields.push(field);
			if(options.display == true){
			this.display.push(field);
			}
		}
		else {
			stdError.missingParameter('options');
			return -1;
		}
	}

	return {
		//properties
		name: name,
		display: display,
		fields: field,
		child: child,

		//methods
		addField: addField,
	}
   }
    
    return type;
});
