/*!
 * https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md
 * https://github.com/johnpapa/ng-demos
 */
(function () {

    'use strict';

    angular
        .module('app.route', ['ngRoute'])
        .config(routeConfig);

    routeConfig.$inject = ['$routeProvider'];

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
            .when('/ui-treegrid', {
                templateUrl: 'app/treegrid/index.html',
                controller: 'TreeGridCtrl',
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