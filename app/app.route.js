(function () {

    'use strict';

    angular.module('app.route', [
        'ui.router'
    ]);

    angular.module('app.route')
        .config(config);

    /* @ngInject */
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider.state('ui-bootstrap', {
            url: '/ui-bootstrap',
            templateUrl: 'app/bootstrap/index.html',
            controller: 'BootstrapCtrl',
            controllerAs: 'vm'
        }).state('ui-grid', {
            url: '/ui-grid',
            templateUrl: 'app/grid/index.html',
            controller: 'GridCtrl',
            controllerAs: 'vm'
        }).state('ui-select', {
            url: '/ui-select',
            templateUrl: 'app/select/index.html',
            controller: 'SelectCtrl',
            controllerAs: 'vm'
        }).state('welcome', {
            url: '/welcome',
            templateUrl: 'app/welcome.html'
        });
        $urlRouterProvider.otherwise('welcome');
    }

    // angular
    //     .module('app.route', [
    //         'ngRoute'
    //     ]).config(config);
    //
    // /* @ngInject */
    // function config($routeProvider) {
    //     $routeProvider
    //         .when('/ui-bootstrap', {
    //             templateUrl: 'app/bootstrap/index.html',
    //             controller: 'BootstrapCtrl',
    //             controllerAs: 'vm'
    //         })
    //         .when('/ui-grid', {
    //             templateUrl: 'app/grid/index.html',
    //             controller: 'GridCtrl',
    //             controllerAs: 'vm'
    //         })
    //         .when('/ui-select', {
    //             templateUrl: 'app/select/index.html',
    //             controller: 'SelectCtrl',
    //             controllerAs: 'vm'
    //         })
    //         .when('/welcome', {
    //             templateUrl: 'app/welcome.html'
    //         })
    //         .otherwise({
    //             redirectTo: '/welcome'
    //         });
    // }

    // function addActiveClassToMenuItem() {
    //     var anchor = window.location.hash;
    //     anchor && $('.dropdown-menu a[href="' + anchor + '"]').parent().addClass('active');
    // }

})();