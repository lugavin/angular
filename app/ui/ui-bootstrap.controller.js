/*!
 * https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md
 */
(function () {

    'use strict';

    angular
        .module('app.ui.bootstrap')
        .controller('MainCtrl', MainCtrl)
        .controller('ModalCtrl', ModalCtrl);

    function MainCtrl($scope, $http, $uibModal, $log) {

        $scope.user = {};

        $scope.edit = function (row) {
            $uibModal.open({
                templateUrl: 'save.html',
                controller: 'ModalCtrl',
                size: 'lg'
            });
        };

        $scope.delete = function (row) {
            var source = {code: '0168'};
            var destination = {name: 'Gavin'};
            console.log(angular.extend({}, source, destination));
            console.log(angular.copy(source));
        };

        $scope.view = function (row) {
            $log.info(row);
        };

        $scope.query = function () {
            $http({
                method: 'POST',
                url: '../../data/Grid.json',
                data: $scope.user
            }).then(function (response) {
                console.info(response);
            });
        };

        var initData = {uid: 1001, username: 'Gavin'};

        $scope.reset = function () {
            $scope.user = angular.copy(initData);
        };

        $scope.reset();
    }

    function ModalCtrl($scope, $uibModalInstance, $log, items) {

        $scope.user = items;

        $scope.save = function () {
            $uibModalInstance.close(true);
        };

        $scope.close = function () {
            $uibModalInstance.dismiss(0);
        };

    }

})();
