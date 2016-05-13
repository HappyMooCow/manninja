define(['socketio', 'app/class/events'], function(io, ev) {
	return function(){
		var socket = io.connect('http://localhost:3000');
		var events = new ev();

			socket.on('item', function(item) {
				events.publish('got_item', item);
			});

			socket.on('type', function(type) {
				events.publish('got_type', type);
			});

			socket.on('tag', function(tag) {
				events.publish('got_tag', tag);
			});

			socket.on('field', function(field) {
				events.publish('got_field', field);
			});

			socket.on('error', function(error) {
				//TODO handle errors
			});

		return {
			socket: socket,
			events: events
		}
	}
});
