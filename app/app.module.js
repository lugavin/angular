/*!
 * https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md
 * https://github.com/johnpapa/ng-demos
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

    interceptorConfig.$inject = ['$httpProvider'];
    init.$inject = ['$rootScope'];
    httpInterceptor.$inject = ['$q', '$injector', '$log'];

    function interceptorConfig($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }

    function init($rootScope) {
        $rootScope.$on('$uibModalInstance.opened', function (e, $uibModalInstance) {
            console.log($uibModalInstance);
        });
    }

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