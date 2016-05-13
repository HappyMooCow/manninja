define(function () {
    function notifier(input) {
        var stack = new Array,
            sequence = Promise.resolve(),
            options = input,
            running = false;        

        function showNext() {
            let next = stack.shift();
            if (typeof next != 'undefined') {
                next();
            }
            else {
                running = false;
            }
        }

        function showAlert(target) {
            target.appendTo('body');
            target.fadeIn(options.fadeInSpeed, function () {
                window.setTimeout(function () { hideAlert(target) }, options.displayLength)
            });            
        }

        function hideAlert(target) {
            target.fadeOut(options.fadeOutSpeed, function () {
                target.remove();
                showNext();
            });
        }

        function queueAlert(options) {
            let alert = $('<div>', { class: 'alert notifier' })

            alert.addClass(options.type);
            alert.text(options.text);

            stack.push((function () { showAlert(alert) }));
            if (running == false) {
                running = true;
                showNext();
            }
        }
        
        this.showAlert = function (options) {
            queueAlert(options);
            
        }
    
    }

    notifier.type = {
        success: 'alert-success',
        info: 'alert-info',
        warning: 'alert-warning',
        danger: 'alert-danger'
    }

    return notifier
})