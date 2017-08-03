/*!
 * https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md
 */
(function () {

    'use strict';


    angular.module('app', [
        'app.route',
        'app.bootstrap.module',
        'app.grid.module',
        'app.treegrid.module',
        'app.select.module'
    ]).config(configuration)
        .run(initialization)
        .factory('httpInterceptor', ['$q', '$injector', '$log', httpInterceptor]);

    function configuration($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }

    function initialization($rootScope) {
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