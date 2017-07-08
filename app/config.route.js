/*!
 * https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md
 */
(function () {

    'use strict';

    angular.module('app.config.route', [
        'ngRoute'
    ]).config(Route);

    function Route($routeProvider) {
        $routeProvider
            .when('/ui-grid', {templateUrl: './ui/ui-grid.html'})
            .when('/ui-bootstrap', {templateUrl: './ui/ui-bootstrap.html'})
            .otherwise({redirectTo: '/'});
    }

})();