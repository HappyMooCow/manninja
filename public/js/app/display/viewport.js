define(['app/class/events'], function (ev) {
	return function(){
        var DOM;

        //private methods
        function createElements() {
            let base = $('<div>', { class: 'display' });
            return base
        }

        //constructor
        DOM = createElements();

    return {
	//class
	events: new ev(),
	
	//properties
	html: DOM,

	//method
	clear: function() {
		$(DOM).data('ref', undefined);
		DOM.html('');
	},

	render: function(target) {
            $(DOM).data('ref', target);
            $(DOM).html(target.html());
            target.init();
	},

	place: function(target) {
		$(target).append(DOM);
	}
	}
}
});
