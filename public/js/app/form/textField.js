define(function () {
    function textField(i) {
        var value = i;
        var _fg = $('<div>', { class: 'form-group' }),
            _txt = $('<input>', { type: 'text', class: 'input form-control', id: value.field.name }),
            _lbl = $('<label>', { for: value.field.name, text: value.field.name });

        _fg.append($(_lbl));
        _lbl.after($(_txt));

        this.submit = function () {
            return {field: value.field, value: _txt.val()}
        }

        this.html = function () {
            return _fg;
        }

        this.val = function (i) {
            _txt.val(i);
        }

        this.field = function () {
            return getField();
        }

        var getField = function () {
            return value.field;
        }
    }

    return textField;
})