(function () {

    'use strict';

    angular
        .module('app.route', [
            'ngRoute'
        ]).config(routeConfig);

    /* @ngInject */
    function routeConfig($routeProvider) {
        $routeProvider
            .when('/ui-bootstrap', {
                templateUrl: 'app/bootstrap/index.html',
                controller: 'BootstrapCtrl',
                controllerAs: 'vm'
            })
            .when('/ui-grid', {
                templateUrl: 'app/grid/index.html',
                controller: 'GridCtrl',
                controllerAs: 'vm'
            })
            .when('/ui-select', {
                templateUrl: 'app/select/index.html',
                controller: 'SelectCtrl',
                controllerAs: 'vm'
            })
            .when('/welcome', {
                templateUrl: 'app/welcome.html'
            })
            .otherwise({
                redirectTo: '/welcome'
            });
    }

})();