define(['app/ca/connect', 'app/class/events'], function(server, ev) {
	function zookeeper() {
		var events = new ev();
		var connection = new server();
		//TODO batching	var stack = new promise.resolve();

		connection.events.subscribe('got_item', function(item) {
			if(item.length){
				for(var i=0; i<item.length; i++) {
					events.publish('got_item', item[i]);
					return;	
				}
			}
			events.publish('got_item', item);
		});		

		connection.events.subscribe('got_type', function(type) {
			if(type.length){
				for(var i=0; i<type.length; i++) {
					events.publish('got_type', type[i]);
					return;	
				}
			}
			events.publish('got_type', type);
		});		

		connection.events.subscribe('got_tag', function(tag) {
			if(tag.length){
				for(var i=0; i<tag.length; i++) {
					events.publish('got_tag', tag[i]);
					return;	
				}
			}
			events.publish('got_tag', tag);
		});		

		connection.events.subscribe('got_field', function(field) {
			if(field.length){
				for(var i=0; i<field.length; i++) {
					events.publish('got_field', field[i]);
					return;	
				}
			}
			events.publish('got_field', field);
		});		

		function saveItem(item) {
			connection.socket.emit('item', item)				
		}

		function saveType(type) {
			connection.socket.emit('type', type)
		}

		function saveTag(tag) {
			connection.socket.emit('tag', tag)
		}

		function saveField(field) {
			connection.socket.emit('field', field)
		}

		function connect() {
			//TODO
		 };

		function disconnect() {
			//TODO
		 };
		
		 return {
			saveItem: saveItem,	
			saveType: saveType,
			saveTag: saveTag,
			saveField: saveField,

			events: events,
			connect: connect,
			disconnect: disconnect,
		}
	}

	return zookeeper
});
