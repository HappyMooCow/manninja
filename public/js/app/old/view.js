define(["app/ClientArchitecture", 'widgets/Display', ], function (arch, display) {
    CA = new arch();

    //define ui
    var body = $('body'),
        container = $('<div>', { class: 'container' }).appendTo(body)
        .append($('<div>', { class: 'row' })
        .append($('<div>', { class: 'col-sm-12 col-md-12 form-group', id: 'search'}))
        .append($('<div>', { class: 'col-sm-12 col-md-12', id: 'display' })));
        
        
        
    var disp = new display();
    disp.place($('#display'));

    $('<label>', { text: 'insert job ID' }).appendTo('#search');

    $('<input>', { type: 'text', class: 'form-control' }).change(function () {
        var itm = CA.findItemByField('jobID', $(this).val())
        CA.openItem(itm)
    }).appendTo('#search')

    var reposub = CA.events.subscribe('objectAdded', function (obj) {
        if (obj.object instanceof CA.form) {
            disp.render(obj.object);
        }
    });

    CA.load();
})