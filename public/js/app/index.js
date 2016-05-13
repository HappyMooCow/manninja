define(function (require) {
	require(['app/ca/main'], function(ca) {
		console.log('loaded ca');
		window.CA = new ca();
	});

	require(['app/display/menu'], function(menu) {
		console.log('loaded menu');
		window.Menu =  new menu();

		window.Menu.addMenuItem(0, new window.Menu.menuItem({
			name: 'test'
		}));
	});
});
