define(["app/ClientArchitecture", "widgets/Menu", 'widgets/Sidebar', 'widgets/Display', 'widgets/Modal', 'widgets/newTypeForm', 'widgets/table'], function (arch, menu, sidebar, display, modal, ntf, table) {
    //define client architecture
    CA = new arch();


            //define layout
            var base = $('<div>', { class: 'container-fluid' }),
                row = $('<div>', { class: 'row-fluid' }).appendTo($(base)),
                sidepanel = $('<div>', { class: 'col-md-2' }).appendTo($(row)),
                displaypanel = $('<div>', { class: 'col-md-10' }).appendTo($(row));

            base.appendTo($('body'));


            //define UI
            

            

            
            
            menubar = new menu("Manufacture.Ninja", new Array(
                new menu.MenuItem('new', new Array(
                    new menu.MenuItem('Item', typesToMenuItems(CA.getAllTypes()))
                    //new menu.MenuItem('type',[],CA.newType)
                )),
                new menu.MenuItem('open', new Array(
                    new menu.MenuItem('items', typesToMenuItems(CA.getAllTypes))
                )),
                new menu.MenuItem('Admin', new Array(
                    new menu.MenuItem('create new type', [],CA.newType)
                ))
                ));

            menubar.render($('body'));


            side = new sidebar();

            var sub = side.events.subscribe('click', function (obj) {
                console.log(obj.target);
            })

            side.render($(sidepanel));


            disp = new display();
            disp.place($(displaypanel));


            //var frm = new CA.form('New Type', new ntf);
            //disp.render(frm);
    /**
            //test code
            //function randomString() {
            //    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            //        out = '';

            //    for (var i = 0; i < 10; i++) {
            //        out += possible.charAt(Math.floor(Math.random() * possible.length));
            //    }

            //    return out
            //}

            

            //var reposub = CA.events.subscribe('objectAdded', function (obj) {
            //    if (obj.object instanceof CA.item) {
            //        let frm = CA.newForm(obj.object);
            //        let func = function () { disp.render(frm.main); console.log('onclick') }
            //        side.addItems(new Array(
            //            new sidebar.Item(
            //            obj.object.name,
            //            func,
            //            obj.object
            //            )));
            //    }
            //    else if (obj.object instanceof CA.form) {
            //        disp.render($(obj.object.main));
            //    }
            //    else if (obj.object instanceof CA.type) {
            //        menubar.appendToMenuItem('item', typesToMenuItems([obj.object]));
            //    }
            //});

            //var cFields = new Array(
            //    new CA.field('text', 'firstName'),
            //    new CA.field('text', 'lastName'),
            //    new CA.field('text', 'phoneNumber')
            //    );
            //var customer = CA.newType('customer', ['firstName', 'lastName'], cFields);

            //function getCustomers() {
            //    return CA.getItemsByType(customer);
            //}

            //var fields = new Array(
            //    new CA.field('text', 'Comments'),
            //    new CA.field('select', 'Customer',
            //        getCustomers
            //    )
            //    );

            //var job = CA.newType('job', ['Comments'], fields);

            //for (var i = 0; i < 1; i++) {
            //    let _tmp = CA.newItem(customer);
            //    _tmp.setField('firstName', randomString());
            //    _tmp.setField('lastName', randomString());
            //}


            //var _job = CA.newItem(job);

            //CA.newForm(_job);

            //var frmSub = CA.form.events.subscribe('changed', function (obj) {
            //    console.log('form changed:');
            //    console.log(obj);
            //})
            */

    //event binding           

            var subItemChange = CA.item.events.subscribe('changed', function (obj) {
                side.update(obj.ref);
            });

            var reposub = CA.events.subscribe('repo', function (obj) {
                if (obj.object instanceof CA.item) {                    
                    
                }
                else if (obj.object instanceof CA.form) {
                    let func = function () { disp.render(obj.object)}
                    side.addItems(new Array(
                        new sidebar.Item(
                        obj.object.title,
                        func,
                        obj.object
                        )));
                    disp.render(obj.object);
                }
                else if (obj.object instanceof CA.type) {
                    menubar.appendToMenuItem('Item', typesToMenuItems([obj.object]));
                    menubar.appendToMenuItem('items', typesToOpenMenuItems([obj.object]));
                }
            });

            var tsub = CA.events.subscribe('objectRemoved', function (obj) {
                if (obj instanceof CA.form) {
                    side.removeItem(obj);
                    if ($(disp.html()).data('ref').is(obj)) {
                        disp.clear();
                    }
                }
            })            

            var tblSub = table.events.subscribe('clicked', function (item) {
                CA.openItem(item);
            })
            //var frmSub = CA.form.events.subscribe('changed', function (obj) {
            //    console.log('form changed:');
            //    console.log(obj);
            //});

    //loading code
            CA.load();

            
        });