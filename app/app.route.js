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
            .otherwise({redirectTo: '/'});
    }

})();