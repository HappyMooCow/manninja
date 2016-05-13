define(function () {
    function tagField() {
        //variable declarations
        var root = $('<div>', { class: 'panel panel-default' }),
            heading = $('<div>', { class: 'panel-heading' }).appendTo(root),
            title = $('<p>', { text: 'Tags' }).appendTo(heading),
            body = $('<div>', { class: 'panel-body' }).appendTo(root);

        //create new tag input
        var nGroup = $('<div>', { class: 'form-group col-md-4' })
            .append($('<label>', { text: 'New Tag' })),
            iGroup = $('<div>', { class: 'input-group' }).appendTo(nGroup),
            n = $('<input>', { type: 'text', class: 'form-control' }).appendTo(iGroup),
            biGroup = $('<span>', {class: 'input-group-btn'}).appendTo(iGroup),
            b = $('<button>', { type: 'button', class: 'btn btn-secondary', text: 'add' }).appendTo(biGroup);

        //function declarations
        var getTags = function () {
            return Architecture.getAllTags()
            //get tags function here
        }

        var saveTag = function() {
            //save tag function here
        }

        var tags = getTags(),
            select = $('<select>', { multiple: 'multiple', class: 'form-control' });
        for (var i = 0; i < tags.length; i++) {
            $('<option>', { text: tags[i].name, value: tags[i] }).data('ref', tags[i]).appendTo(select);
        }

        //priveleged function declarations
        this.init = function () {
            //event binders
            b.click(function () {
                //add new tag function here
            })
        }

        this.submit = function () {
            // submit function here
            var out = [];
            select.find(':selected').each(function(){
                out.push($(this).data('ref'))
            })

            return out;
        }

        this.html = function () {
            return root;
        }

        //constructor
        nGroup.appendTo(body);
        select.appendTo(body);
        this.init();
    }

    return tagField;
})