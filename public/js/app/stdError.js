define(function(){
	function stdError(){}
	
	stdError.missingParameter = function(parameter){
		console.log('the function: ' + arguments.callee.toString() + ' did not execute due to missing required parameter: ' + parameter);
	}

	stdError.constructorFailed = function(){
		console.log('constructor: ' + arguments.callee.toString() + ' did not complete successfully');
	}
	
	return stdError()
})
