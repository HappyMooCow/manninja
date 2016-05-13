requirejs.config({
	baseUrl: '/js',
	paths: {
		app:'./app',
		socketio: '../../socket.io/socket.io',
		jquery: './lib/jquery-2.2.3.min',
	}
});

requirejs(['jquery']);
