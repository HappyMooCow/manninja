define(function () {
    function Modal(title, ibody, ifooter) {
        var root = $('<div>', {
            class: 'modal fade'
        }),
            base = $('<div>', {
                class: 'modal-dialog'
            }).appendTo(root),
            content = $('<div>', {
                class: 'modal-content'
            }).appendTo(base),
            header = $('<div>', {
                class: 'modal-header'
            }).appendTo(content),
            body = $('<div>', {
                class: 'modal-body'
            }).appendTo(content),
            footer = $('<div>', {
                class: 'modal-footer'
            }).appendTo(content);

        header.append($('<h1>', {
            text: title
        }));

        body.append($(ibody.html()));
        body.data('form', ibody);
        footer.append($(ifooter));
        footer.append($('<button>', { class: 'btn btn-default', text: 'submit' }).data('parent', this).click(function () { $(this).data('parent').submit() }));
        

        $(root).modal({ backdrop: true, keyboard: true, show: false });

        this.show = function () {
            $(root).modal('show')
        }

        this.hide = function () {
            $(root).modal('hide')
        }

        this.submit = function () {
            body.data('form').submit();
        }
    }


    return Modal;
})