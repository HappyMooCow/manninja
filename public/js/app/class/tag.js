define(function () {
    function Tag(n, d) {
        var name = n,
            id = d;

        this.name = function (input) {
            if (input) {
                name = input;
            }
            else {
                return name;
            }
        }
        this.id = function () {
            return id
        }
    }

    return Tag
})