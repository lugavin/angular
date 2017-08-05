/*!
 * {@link https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md}
 * {@link https://github.com/johnpapa/ng-demos}
 */
(function () {

    'use strict';

    /**
     * 声明模块(每个独立子模块使用唯一的命名约定以避免命名冲突)
     */
    angular.module('app', [
        'app.route',
        'app.bootstrap.module',
        'app.grid.module',
        'app.treegrid.module',
        'app.select.module'
    ]).config(interceptorConfig)
        .run(init)
        .factory('httpInterceptor', httpInterceptor);

    /**
     * 声明依赖时用$inject手动添加组件所需的依赖(避免使用缩写语法导致压缩时的不安全性问题)
     */
    // interceptorConfig.$inject = ['$httpProvider'];
    // init.$inject = ['$rootScope'];
    // httpInterceptor.$inject = ['$q', '$injector', '$log'];

    /**
     * 在Gulp或Grunt中使用ng-annotate, 用 \/* @ngInject *\/ 对需要自动依赖注入的function进行注释,
     * 这样当代码通过ng-annotate运行时, 就会产生带有$inject注释的输出结果, 避免压缩时的不安全性问题.
     *
     * {@link https://github.com/olov/ng-annotate}
     */
    /* @ngInject */
    function interceptorConfig($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }

    /* @ngInject */
    function init($rootScope) {
        $rootScope.$on('$uibModalInstance.opened', function (e, $uibModalInstance) {
            console.log($uibModalInstance);
        });
    }

    /* @ngInject */
    function httpInterceptor($q, $injector, $log) {
        return {
            request: function (config) {
                $log.debug('Request: ' + config.url);
                var deferred = $q.defer();
                deferred.resolve(config);
                // return $q.reject('Request error.');
                return deferred.promise;
            },
            response: function (response) {
                $log.debug('Response: ' + response.status);
                var deferred = $q.defer();
                deferred.resolve(response);
                return deferred.promise;
            },
            requestError: function (rejection) {
                $log.debug('========== requestError ==========');
                return $q.reject(rejection);
            },
            responseError: function (rejection) {
                $log.debug('========== responseError ==========');
                return $q.reject(rejection);
            }
        };
    }

})();