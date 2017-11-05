/*!
 * Base.js v1.0
 * https://lugavin.github.io/
 * Copyright 2015-2017 Gavin Inc.
 */
(function (root, factory) {

    if (typeof(root.Namespace) === 'undefined') {
        throw new Error('Base\'s JavaScript requires Namespace v1.0 or later')
    }

    factory(root.Namespace);

})(window, function (Namespace) {

    /**
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

    Base.genRandomNum = function () {
        return Base.format('{0}_{1}', new Date().getTime(), Math.floor(Math.random() * 1000000));
    };

    Base.isBoolean = function (value) {
        return typeof value === 'boolean';
    };

    Base.isString = function (value) {
        return typeof value === 'string';
    };

    Base.isArray = Array.isArray;

    Base.isFunction = function (value) {
        return typeof value === 'function';
    };

    Base.isObject = function (value) {
        return value !== null && typeof value === 'object';
    };

    Base.isEmptyObject = function (obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    };

    Base.hasMobileUA = function () {
        var nav = window.navigator;
        var ua = nav.userAgent;
        var pa = /iPad|iPhone|Android|Opera Mini|BlackBerry|webOS|UCWEB|Blazer|PSP|IEMobile|Symbian/g;
        return pa.test(ua);
    };

    Base.isTablet = function () {
        return window.screen.width < 992 && window.screen.width > 767 && Base.hasMobileUA();
    };

    Base.isMobile = function () {
        return window.screen.width < 767 && Base.hasMobileUA();
    };

    Base.isDesktop = function () {
        return !Base.isTablet() && !Base.isMobile();
    };

    Base.getURLParam = function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null;
    };

});
