(function () {

    'use strict';

    angular.module('app.service', [])
        .factory('tokenService', tokenService);

    /* @ngInject */
    function tokenService($http, $q) {

        var servic = this;

        servic.genSubmitToken = genSubmitToken;

        return servic;

        function genSubmitToken() {

            var deferred = $q.defer();

            $http.get('data/Data.json').then(function (response) {
                // Asynchronous succeeded
                deferred.resolve(response);
            }, function (rejection) {
                // Asynchronous failed
                deferred.reject(rejection);
            });

            return deferred.promise;
        }

    }

})();