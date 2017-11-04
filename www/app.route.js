(function () {

    'use strict';

    angular
        .module('app.route', [
            'ngRoute'
        ]).config(config);

    /* @ngInject */
    function config($routeProvider) {
        $routeProvider
            .when('/ui-bootstrap', {
                templateUrl: 'www/bootstrap/index.html',
                controller: 'BootstrapCtrl',
                controllerAs: 'vm'
            })
            .when('/ui-grid', {
                templateUrl: 'www/grid/index.html',
                controller: 'GridCtrl',
                controllerAs: 'vm'
            })
            .when('/ui-select', {
                templateUrl: 'www/select/index.html',
                controller: 'SelectCtrl',
                controllerAs: 'vm'
            })
            .when('/welcome', {
                templateUrl: 'www/welcome.html'
            })
            .otherwise({
                redirectTo: '/welcome'
            });
    }

})();