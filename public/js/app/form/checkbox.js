define(function () {
    function checkbox(title) {
        var root = $('<div>', { class: 'panel panel-default' }),
        header = $('<div>', { class: 'panel-heading' }).appendTo(root),
        body = $('<div>', { class: 'panel-body' }).appendTo(root);

        header.append($('<h5>', { text: title }))

        this.addCheckbox = function (ref) {            
            $('<div>', { class: 'checkbox' }).append($('<label>').append($('<input>', { value: ref, type: 'checkbox' }).data('ref', ref)).append(ref.name)).appendTo(body);
        }

        this.submit = function () {
            let o = [];
            $('input', body).each(function () {
                if($(this).prop('checked') == true){
                    o.push($(this).data('ref'));
                }                 
            })
            console.log(o);
            return o;
        }

        this.html = function () {
            return root;
        }

        this.clear = function () {
            body.html('');
        }        
    }
    
    return checkbox
})