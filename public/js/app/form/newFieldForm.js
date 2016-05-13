define(['app/Field', 'app/fieldFilter'], function (field, filter) {
    function newFieldForm(x) {
        var root = $('<div>', {class:'newTypeForm'}),
            type = $('<select>', {
                id: 'type',
                class: 'form-control'
            })
            .append($('<option>', {
                text: 'text',
                value: 'text'
            }))
            .append($('<option>', {
                text: 'select',
                value: 'select'
            }))
            .append($('<option>', { text: 'collection', value: 'collection' }))
            .append($('<option>', {text: 'item', value: 'item'})),
            name = $('<input>', {
                id: 'description',
                type: 'text',
                class: 'form-control'
            }),
            options = $('<select>', {
                id: 'options',
                class: 'form-control',
                disabled: false
            })
            .append($('<option>', { text: 'Type' }))
            .append($('<option>', { text: 'Tag' })),
            tag = $('<select>', {
                id: 'tag',
                class: 'form-control',
                disabled: false
            }),
            types = $('<select>', {
                id: 'types',
                class: 'form-control',
                disabled: false
            });
       

        $(type).change(function () {
            filterDisplay();
        })

        $(options).change(function () {
            if ($(options).val() == 'Tag') {
                tag.parent().show();
                types.parent().hide();
            }
            else {
                tag.parent().hide();
                types.parent().show();
            }
        })

        var filterDisplay = function () {
            switch ($(type).val()) {
                case 'text':
                    $(options).parent().hide();
                    $(tag).parent().hide();
                    $(types).parent().hide();
                    break;
                case 'select':
                    $(options).parent().show();
                    $(tag).parent().show;
                    $(types).parent().show();
                    break;
                case 'collection':
                    $(options).parent().show();
                    $(tag).parent().show;
                    $(types).parent().show();
                    break;
                case 'item':
                    $(options).parent().show();
                    $(tag).parent().show;
                    $(types).parent().show();
                    break;
            }
        }

        $('<div>', {
            class: 'form-group'
        })
            .append($('<label>', {
                text: 'Name'
            }))
        .append(name)
        .appendTo(root);

        $('<div>', {
            class: 'form-group'
        })
            .append($('<label>', {
                text: 'Type'
            }))
        .append(type)
        .appendTo(root);

        $('<div>', {
            class: 'form-group'
        })
            .append($('<label>', {
                text: 'Option'
            }))
        .append(options)
        .appendTo(root);

        $('<div>', {
            class: 'form-group'
        })
            .append($('<label>', {
                text: 'Type'
            }))
        .append(types)
        .appendTo(root);

        $('<div>', {
            class: 'form-group'
        })
            .append($('<label>', {
                text: 'Tag'
            }))
        .append(tag)
        .appendTo(root);

        

        

        this.populateSelect = function () {
            let x = Architecture.getAllTypes();
            for (var i = 0; i < x.length; i++) {
                types.append($('<option>', {text: x[i].name}).data('ref', x[i]))
            }
        }

        var populateTags = function () {
            let x = Architecture.getAllTags();
            for (var i = 0; i < x.length; i++) {
                tag.append($('<option>', { text: x[i].name }).data('ref',x[i]))
            }
        }

        this.populateSelect();
        populateTags();

        filterDisplay();
        //load
        if (x) {            
                if (typeof x.type != 'undefined') {
                    type.val(x.type);
                }

                if (typeof x.options != 'undefined') {
                    options.val(x.options.substring(1));
                }

                if (typeof x.description != 'undefined') {
                    description.val(x.description);
                }
        }
        
        

        this.submit = function () {            
            let o = new field()
            o.name = name.val();
            o.type = type.val();
            o.filter = new filter();
            
            if (options.is(':visible')) {
                if (options.val() == 'Tag') {
                    o.filter.filterType = 'typeByTag';
                    o.filter.tag = tag.find(':selected').data('ref');
                }
                else {
                    o.filter.filterType = 'type';
                    o.filter.type = types.find(':selected').data('ref');
                }
            }


            return o;
        }

        this.html = function () {
            return root;
        }
    }
    return newFieldForm;
})