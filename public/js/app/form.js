define(function () {
    function form(title, content) {
        var root = $('<div>'),
            header = $('<div>').appendTo(root),
            body = $('<div>').appendTo(root),
            footer = $('<div>').appendTo(root);

        this.title = title;

        $('<h1>', { text: title }).appendTo(header);

        body.data('object', content);
        content.html().appendTo(body);

        //$('<button>', { class: 'btn btn-default', text: 'cancel', id: 'cancel' }).data('parent', this).click(function () { $(this).data('parent').cancel() }).appendTo(footer);
        //$('<button>', { class: 'btn btn-primary', text: 'submit', id: 'submit' }).data('parent', this).click(function () { $(this).data('parent').submit() }).appendTo(footer);

        $('<button>', { class: 'btn btn-default', text: 'cancel', id: 'cancel' }).appendTo(footer);
        $('<button>', { class: 'btn btn-primary', text: 'submit', id: 'submit' }).appendTo(footer);

        this.submit = function () {
            let obj = body.data('object').submit();
            form.events.publish('submit', obj);
            form.events.publish('close', this);
        }

        this.cancel = function () {
            form.events.publish('close', this);
        }

        this.html = function () {
            return root;
        }

        this.init = function () {
            $('#cancel', footer).data('parent', this).click(function () { $(this).data('parent').cancel() });
            $('#submit', footer).data('parent', this).click(function () { $(this).data('parent').submit() });
        }

        this.init();

        form.events.publish('new', this);
    }

    form.events = (function () {
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
    })();

    form.prototype.is = (function (b) {
        var isEqual = function (a, b) {
            let aProps = Object.getOwnPropertyNames(a),
            bProps = Object.getOwnPropertyNames(b);

            //check length
            if (aProps.length != bProps.length) {
                return false
            }

            //check equality
            for (var i = 0; i < aProps.length; i++) {
                let propName = aProps[i];
                if (typeof a[propName] == 'object') {
                    if (!isEqual(a[propName], b[propName])) { return false }
                }
                else if (a[propName] != b[propName]) { return false }
            }

            //return
            return true
        }

        return isEqual(this, b);
    })
    return form
})