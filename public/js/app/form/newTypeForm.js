define(['widgets/newFieldForm', 'widgets/collection', 'app/Type', 'widgets/checkbox', 'widgets/tagField'],function (fieldForm, collection, type, check, tagField) {
    function newTypeForm(x) {
        var root = $('<div>', { class: 'newTypeForm' }),
            name = $('<input>', {
                type: 'text',
                id: 'name',
                class: 'form-control'
            }),
            fields = new collection('Fields', fieldForm),
            display = new check('Display'),
            child = new check('Options'),
            tag = new tagField();
            
        if (x) {
            name.val(x.name);
        }

        //load fields
        for (var i = 0; i < x.fields.length; i++) {
            fields.add(x.fields[i])
        }

        $(fields.html()).hover(function () {
            let f = fields.submit();
            display.clear();
            for (var i = 0; i < f.length; i++) {
                display.addCheckbox(f[i]);
            }
        }, function () {
            let f = fields.submit();
            display.clear();
            for (var i = 0; i < f.length; i++) {
                display.addCheckbox(f[i]);
            }
        });

        root.append($('<div>', {
            class: 'form-group'
        }).append($('<label>', { text: 'Name' })).append(name))

        root.append($('<div>', { class: 'form-group' }).append(fields.html()));

        root.append(display.html());

        child.addCheckbox({name: 'Child'});
        root.append(child.html());

        root.append(tag.html());

        this.html = function () {
            return root;
        }

        this.submit = function () {     
            if (x) {
                x.name = name.val(),
                x.display = display.submit(),
                x.fields = fields.submit(),                
                x.tags = tag.submit();

                if (child.submit().length > 0) {
                    x.child = true
                }
                else {
                    x.child = false
                }
                return x
            }

            let o = new type(
                name.val(),
                display.submit(),
                fields.submit())

            if (child.submit().length > 0) {
                o.child = true
            }
            else {
                o.child = false
            }

            o.tag = tag.submit();
            return o;
        }
    }

    return newTypeForm
})