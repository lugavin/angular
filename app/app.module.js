/*!
 * @see {@link https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md}
 * @see {@link https://github.com/johnpapa/ng-demos}
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
        .factory('asyncService', asyncService)
        .factory('httpInterceptor', httpInterceptor);

    /**
     * 声明依赖时用$inject手动添加组件所需的依赖(避免使用缩写语法导致压缩时的不安全性问题)
     */
    // interceptorConfig.$inject = ['$httpProvider'];
    // init.$inject = ['$rootScope'];
    // asyncService.$inject = ['$http'];
    // httpInterceptor.$inject = ['$q', '$injector', '$log'];

    /**
     * 在Gulp或Grunt中使用ng-annotate, 用 \/* @ngInject *\/ 对需要自动依赖注入的function进行注释,
     * 这样当代码通过ng-annotate运行时, 就会产生带有$inject注释的输出结果, 避免压缩时的不安全性问题.
     *
     * @see {@link https://github.com/olov/ng-annotate}
     */
    /* @ngInject */
    function interceptorConfig($httpProvider) {
        $httpProvider.interceptors.push(httpInterceptor);
    }

    /* @ngInject */
    function init($rootScope) {
        $rootScope.$on('$uibModalInstance.opened', function (e, $uibModalInstance) {
            console.log($uibModalInstance);
        });
    }

    /* @ngInject */
    function asyncService($http) {

        var servic = this;

        servic.genToken = genToken;

        return servic;

        function genToken() {
            return $http.get('data/Data.json');
        }
    }

    /* @ngInject */
    function httpInterceptor($q, $injector, $log) {

        return {
            request: requestInterceptor,
            response: responseInterceptor,
            requestError: requestErrorInterceptor,
            responseError: responseErrorInterceptor
        };

        function requestInterceptor(config) {

            config.requestStartTime = new Date().getTime();

            var deferred = $q.defer();

            config.headers = config.headers || {};

            // var $injector = angular.injector();
            // var asyncService = $injector.get('asyncService');
            // asyncService.genToken().then(function (response) {
            //     // Asynchronous succeeded
            //     config.headers['Submit-Token'] = response.data['Submit-Token'];
            //     deferred.resolve(config);
            // }, function (response) {
            //     // Asynchronous failed
            //     config.headers['Submit-Token'] = null;
            //     deferred.resolve(config);
            // });

            deferred.resolve(config);

            return deferred.promise;
        }

        function responseInterceptor(response) {
            var config = response.config;
            config.requestEndTime = new Date().getTime();
            var milliSeconds = config.requestEndTime - config.requestStartTime;
            $log.debug('Request [ ' + config.url + ' ] completed in [ ' + (milliSeconds / 1000) + ' ] seconds');

            var deferred = $q.defer();
            deferred.resolve(response);
            return deferred.promise;
        }

        function requestErrorInterceptor(rejection) {
            return $q.reject(rejection);
        }

        function responseErrorInterceptor(rejection) {
            return $q.reject(rejection);
        }

    }

})();