define(
["app/ca/repository", "app/class/events", "app/ca/localId", "app/ca/lib", "app/ca/zookeeper"],
function(repository, ev, localId, lib, zookeeper) {	
	return function(){
	// public variables
	var items = new repository();
	var types = new repository();
	var forms = new repository();
	var tags = new repository();
	var fields = new repository();

	// private variables
	var keeper = new zookeeper();
	var id = new localId();
	var events = new ev();	

	//events
	keeper.events.subscribe('got_item', function(item){
		items.add(item);
		events.publish('got_item');
	})

	keeper.events.subscribe('got_type', function(type){
		types.add(type);
		events.publish('got_type');
	})

	keeper.events.subscribe('got_tag', function(tag){
		tags.add(tag);
		events.publish('got_tag');
	})

	keeper.events.subscribe('got_field', function(field){
		fields.add(field);
		events.publish('got_field');
	})

	repository.events.subscribe('new', function(object){
		id.requestId(object);		
		//TODO zookeeper call to server to save
		events.publish('new');
	})

	repository.events.subscribe('delete', function(object){
		id.returnId(object);
		//TODO zookeeper call to server to delete
		events.publish('delete');
	})

	repository.events.subscribe('update', function(object){
		//TODO zookeeper call to server to save
		events.publish('update');
	})

	return {
		// properties
		repository: {
			items: items,
			types: types,
			forms: forms,
			tags: tags,
			fields: fields
		},

		events: events,
		
		// functions
		lib: lib,

		connect: keeper.connect(),
		disconnect: keeper.disconnect(), 
	}
}
});
