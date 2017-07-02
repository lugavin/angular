var baseModule = angular.module('baseModule', []);

baseModule.factory('menuService', function () {

    var factory = {};

    factory.multiply = function (a, b) {
        return a * b
    };

    return factory;

});

baseModule.factory('pageService', ['$http', function ($http) {

    console.info($http);

    var factory = {};

    factory.multiply = function (a, b) {
        return a * b
    };

    return factory;

}]);