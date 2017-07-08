/*!
 * https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md
 */
(function () {

    'use strict';

    angular
        .module('app.ui.bootstrap')
        .controller('MainCtrl', MainCtrl);

    function MainCtrl($scope, $http, $uibModal, $log) {

        $log.info($scope);

        $scope.fnCreate = function () {
            var source = {code: '0168'};
            var destination = {name: 'Gavin'};
            console.log(angular.extend({}, source, destination));
            console.log(angular.copy(source));
        };

        $scope.fnUpdate = function (row) {
            $uibModal.open({
                templateUrl: 'save.html',
                controller: 'ModalCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        return angular.extend({}, row, {title: 'User Update'});
                    }
                }
            });
        };

        $scope.fnDelete = function (row) {
            $log.info(row);
        };

        $scope.fnSearch = function (row) {
            $log.info(row);
        };

        $scope.user = {};

        var queryForPage = function (param, successCallback) {
            $http({
                method: 'POST',
                url: '../../data/DataTable.json',
                data: param
            }).then(function (response) {
                console.info(response);
                $scope.data = response.data.data;
                $scope.recordsTotal = response.recordsTotal;
                $scope.pages = Math.ceil(response.recordsTotal / $scope['pageSize']);
                successCallback && successCallback(response);
            });
        };

        queryForPage();

        $scope.query = function () {
            queryForPage($scope.user, function (response) {
                $log.info(response.data);
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
