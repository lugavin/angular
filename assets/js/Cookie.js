/*!
 * Cookie.js v1.0
 * https://github.com/madmurphy/cookies.js
 * https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
 * https://github.com/angular/bower-angular-cookies/blob/master/angular-cookies.js
 */
(function (root, factory) {

    if (typeof(root.Namespace) === 'undefined') {
        throw new Error('Cookie\'s JavaScript requires Namespace v1.0 or later')
    }

    factory(root.Namespace);

})(window, function (Namespace) {

    /**
     * @namespace cookieStorage
     */
    Namespace.register('cookieStorage');

    cookieStorage.setItem = setItem;
    cookieStorage.getItem = getItem;
    cookieStorage.removeItem = removeItem;
    cookieStorage.setObject = setObject;
    cookieStorage.getObject = getObject;

    function setItem(key, value, options) {
        var cookieWriter = $$CookieWriter();
        cookieWriter(key, value, options);
    }

    function getItem(key) {
        var cookieReader = $$CookieReader();
        return cookieReader()[key];
    }

    function removeItem(key, options) {
        var cookieWriter = $$CookieWriter();
        cookieWriter(key, undefined, options);
    }

    function setObject(key, value, options) {
        setItem(key, toJson(value), options)
    }

    function getObject(key) {
        var value = getItem(key);
        return value ? fromJson(value) : value;
    }

    function $$CookieWriter() {

        return function (name, value, options) {
            document.cookie = buildCookieString(name, value, options);
        };

        function buildCookieString(name, value, options) {
            var path, expires;

            options = options || {};
            expires = options.expires;

            if (typeof options.path === 'undefined') {
                var nodes = document.getElementsByTagName('base');
                var href = nodes && nodes.length > 0 ? nodes[0].href : null;
                path = href ? href.replace(/^(https?\:)?\/\/[^\/]*/, '') : '';
            } else {
                path = options.path;
            }

            if (typeof value === 'undefined') {
                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
                value = '';
            }
            if (typeof expires === 'string') {
                expires = new Date(expires);
            }

            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
            str += path ? ';path=' + path : '';
            str += options.domain ? ';domain=' + options.domain : '';
            str += expires ? ';expires=' + expires.toUTCString() : '';
            str += options.secure ? ';secure' : '';

            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
            // - 300 cookies
            // - 20 cookies per unique domain
            // - 4096 bytes per cookie
            var cookieLength = str.length + 1;
            if (cookieLength > 4096) {
                console.warn('Cookie "%s" possibly not set or overflowed because it was too large (%d > 4096 bytes)!', name, cookieLength);
            }

            return str;
        }
    }

    function $$CookieReader() {
        var lastCookies = {};
        var lastCookieString = '';

        return function () {
            var cookieArray, cookie, i, index, name;
            var currentCookieString = document.cookie || '';
            if (currentCookieString !== lastCookieString) {
                lastCookieString = currentCookieString;
                cookieArray = lastCookieString.split('; ');
                lastCookies = {};
                for (i = 0; i < cookieArray.length; i++) {
                    cookie = cookieArray[i];
                    index = cookie.indexOf('=');
                    if (index > 0) { //ignore nameless cookies
                        name = safeDecodeURIComponent(cookie.substring(0, index));
                        // the first value that is seen for a cookie is the most
                        // specific one.  values for the same cookie name that
                        // follow are for less specific paths.
                        if (typeof lastCookies[name] === 'undefined') {
                            lastCookies[name] = safeDecodeURIComponent(cookie.substring(index + 1));
                        }
                    }
                }
            }
            return lastCookies;
        };

        function safeDecodeURIComponent(str) {
            try {
                return decodeURIComponent(str);
            } catch (e) {
                return str;
            }
        }

    }

    function fromJson(json) {
        return (typeof json === 'string') ? JSON.parse(json) : json;
    }

    function toJson(obj) {
        return (typeof obj === 'undefined') ? undefined : JSON.stringify(obj);
    }

});