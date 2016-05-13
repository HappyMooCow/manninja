define(function(){    
	return function() {
		var topics = {},
		    hOP = topics.hasOwnProperty;

		return {
		    subscribe: function (topic, listener) {
			//create topic object if not created
			if (!hOP.call(topics, topic)) topics[topic] = [];

			//add listener to queue
			var index = topics[topic].push(listener) - 1;

			//provide handle for removal of topic
			return {
			    remove: function () {
				delete topics[topic][index];
			    }
			};
		    },

		    publish: function (topic, info) {
			//check if the topic exists
			if (!hOP.call(topics, topic)) return;

			//fire topic
			topics[topic].forEach(function (item) {
			    item(info != undefined ? info : {});
			});
		    }
		}
	}
});
