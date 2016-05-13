define(function(require){
	require(['app/ca/main']);
	require(['app/display/menu']);
	require(['app/display/viewport'], function(viewport){
		console.log(viewport);
		window.Viewport = viewport;
	});
	require(['app/class/main'], function(classes){
		console.log(classes);
		window.Classes = classes;
	});
});
