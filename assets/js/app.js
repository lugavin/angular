(function (root, factory) {

    if (typeof(Namespace) === 'undefined') {
        Namespace = {};
    }

    /**
     * 声明一个全局变量用来注册命名空间
     * @namespace Namespace
     */
    Namespace.register = function (namespace) {
        var nsArr = namespace.split('.');
        var nsStr = '', codeStr = '';
        nsArr.forEach(function (ns, idx) {
            nsStr += (idx === 0 ? ns : '.' + ns);
            codeStr += 'if (typeof(' + nsStr + ') === "undefined") { ' + nsStr + ' = {}; }';
        });
        codeStr && eval(codeStr);
    };

    factory(root.Namespace);

})(window, function (Namespace) {

    /**
     * 注册[Base]命名空间
     * @namespace Base
     */
    Namespace.register('Base');

    Base.format = function () {
        if (arguments.length == 0) {
            return '';
        }
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            str = str.replace(new RegExp('\\{' + (i - 1) + '\\}', 'gm'), arguments[i]);
        }
        return str;
    };

    Base.formatObject = function (str, obj) {
        /**
         * \s 匹配任何空白字符
         * /g 直接量语法(/regexp/g) 用于执行全局匹配
         */
        return str.replace(/\{\s*([^}\s]+)\s*}/g, function (match, p1, offset, string) {
            return obj[p1]
        });
    };

    Base.genRandomNum = function () {
        return Base.format('{0}_{1}', new Date().getTime(), Math.floor(Math.random() * 1000000));
    }

});