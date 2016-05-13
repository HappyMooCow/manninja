"use strict"

// adding sub items to items is causing the affected menu buttons to grow 10px vertically, fix
define(['jquery', 'app/class/events'], function($, ev) {
	return function() {
        var base = $('<div>', { class: 'container-fluid col-xs-1 no-padding' });
        var header = $('<div>', { class: 'menu-header col-xs-12' }).appendTo(base)
	.html('manufacture.ninja')
	.click('#');
        var sections = new Array(
                $('<div>', { class: 'col-xs-12' }).appendTo(base),
                $('<div>', { class: 'col-xs-12' }).appendTo(base),
                $('<div>', { class: 'col-xs-12' }).appendTo(base)
            );
	var submenu = $('<div>', {class: 'col-xs-1 menu-sub'});

	$(function(){
		base.appendTo($('#row1'));	
		submenu.appendTo($('#row1'));
	});
        

        base.resize(function () {
            sections[sections.length - 1].width(base.width());
        })
        
        
        function renderSubMenu(name) {
            let _sub = $('<ul>', {
                class: 'sub-menu ' + name,
            })
            return _sub
        }
        function renderMenuItem(item) {
            let _out = $('<div>', { class: 'menu-item col-xs-12', html: item.name, id: item.name })
                .click(function () { if (item.href) { item.href() } })
                .data('ref', item.ref)                

            if (item.options.length > 0) {                
                let _sub = renderSubMenu(item.name)
                    .appendTo(_out);

                for (var i = 0; i < item.options.length; i++) {
                    _sub.append(renderMenuItem(item.options[i]));
                }
            }

            bindEventHandlers(_out);
            return _out;
        }
        function bindEventHandlers(target) {
            $(target).click(function (event) {
                submenu.html($(target).children('ul').clone(true));
                submenu.animate({ 'width': 'toggle' }, 250);
                
                event.stopPropagation();
            })

        }
        function removeMenuItem(object) {            
            let items = $(base).find('button');

            items.each(function () {
                try{
                    if ($(this).data('ref').is(object)) {
                        $(this).remove();
                    }
                }
                catch (e) {
                    
                }
            })
        }

        var DOM = function(){return base };        

        var render = function (target) {
            $(target).append(this.DOM);
        }        
        var remove = function (object) {
            removeMenuItem(object);
        }

        var addMenuItem = function (group, item) {
            let list = sections[group]
            list.append(renderMenuItem(item));
        }

        var appendToMenuItem = function (name, item) {
            let ss = '#' + name,
                list = $(ss, base).find('ul');

            if (!list.length) {                
                let temp = $(base).find(ss);

                list = renderSubMenu(name)
                .appendTo(temp);
            }

            list.append(renderMenuItem(item));
        }
    


 	var events = new ev(); 

	var menuItem = function (options) {
		let out = {};
		if(options) {
			out.name = options.name || 'no_name';
			out.options = options.options || [];
			href: options.href || function(){};
			ref: options.ref || {};	
		}
		else {return}

		return out;
    	}

    	var menuItemFromType = function (type, click) {        
        	let t = new menuItem({
			name: type.name,
			href: click,
			ref: type
		});
        	return t;
    	}

	var menuItemFromForm = function (form, click) {
		var t = new Menu.MenuItem({
			name: form.title,
			href: click,
			ref: form
		});
		return t;
	    }

	return{
		//class
		menuItem: menuItem,
		events: events,

		//function
		menuItemFromType: menuItemFromType,
		menuItemFromForm: menuItemFromForm,

		//method
		addMenuItem: addMenuItem,
	} 
}
});
