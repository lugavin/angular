/*!
 * https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md
 */
(function () {

    'use strict';

    angular.module('app.route', [
        'ngRoute'
    ]).config(Route);

    function Route($routeProvider) {
        $routeProvider
            .when('/ui-bootstrap', {templateUrl: 'app/ui/bootstrap.html'})
            .when('/ui-grid', {templateUrl: 'app/ui/grid.html'})
            .when('/ui-treegrid', {templateUrl: 'app/ui/treegrid.html'})
            .when('/ui-select', {templateUrl: 'app/ui/select.html'})
            .when('/welcome', {templateUrl: 'app/welcome.html'})
            .otherwise({redirectTo: '/welcome'});
    }

})();