define(['app/Field'],function (Field) {
    function selectField(i) {
        var value = null,
            field = i.field;
        var _fg = $('<div>', { class: 'form-group' }),
            _sel = $('<select>', { class: 'input form-control', id: i.field.name }),
            _lbl = $('<label>', { for: i.field.name, text: i.field.name });
        
        var setValue = function () {
            value = $(_sel).find(':selected').data('ref');
        }

        _fg.append($(_lbl));
        _lbl.after($(_sel));

        let _options = i.field.filter.getOptions();
        for (var i = 0; i < _options.length; i++) {
            let _tx = _options[i].name(),
                _op = $('<option>', { text: _tx});
            
            $(_op).data('ref', _options[i]);
            $(_sel).append(_op);
        }
        setValue();
        
        //event binding
        _sel.change(function () {
            setValue();
        })

        this.submit = function () {
            return {field: field, value: value}
        }

        this.html = function () {
            return _fg;
        }

        this.val = function (i) {
            try {
                $('option', _sel).each(function () {
                    let r = $(this).data('ref');
                    if (r.is(i)) {
                        $(this).prop('selected', true)
                    }
                })               
                value = i;
            }
            catch(e) {
                return
            }
        }

        this.field = function () {
            return field;
        }
    }

    return selectField;
})