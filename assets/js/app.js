/**
 * @namespace Base
 */
(function (window) {

    /**
     * 声明类(JS中可以用一个函数或一个对象模拟类)
     * 在JS中，函数是Function类的实例，Function间接继承自Object，所以函数也是一个对象。
     */
    var Base = {};

    // 声明类的静态方法
    Base.format = function () {
        if (arguments.length == 0) {
            return null;
        }
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            str = str.replace(new RegExp('\\{' + (i - 1) + '\\}', 'gm'), arguments[i]);
        }
        return str;
    };

    Base.formatString = function (string) {
        var args = arguments;
        var pattern = new RegExp('\\{([1-' + arguments.length + '])\\}', 'g');
        return String(string).replace(pattern, function (match, index) {
            return args[index];
        });
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

    Base.generateRandomNumber = function () {
        return new Date().getTime() * Math.floor(Math.random() * 1000000);
    };

    Base.generateGUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    if (typeof window === 'object' && typeof window.document === 'object') {
        window.Base = Base;
    }

})(window);