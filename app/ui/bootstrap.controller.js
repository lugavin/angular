/*!
 * https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md
 */
(function () {

    'use strict';

    angular
        .module('app.bootstrap.module')
        .controller('BootstrapCtrl', BootstrapCtrl)
        .controller('BootstrapModalCtrl', BootstrapModalCtrl);

    function BootstrapCtrl($http, $uibModal, $log) {

        var vm = this;

        vm.user = {};

        vm.edit = function (row) {
            $uibModal.open({
                templateUrl: 'edit.html',
                controller: 'BootstrapModalCtrl',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    items: function () {
                        return angular.extend({}, row, {title: '更新用户'});
                    }
                }
            });
        };

        vm.delete = function (row) {
            $log.info(row);
        };

        vm.view = function (row) {
            // row.uid = row.uid + '_';
            // row.username = row.username + '_';
            var userExt = angular.extend({}, row);
            userExt.uid = row.uid + '_';
            var userClone = angular.copy(row);
            userClone.username = row.username + '_';
        };

        vm.query = function () {
            $log.info('Query => ' + JSON.stringify(vm.user));
            $http({
                method: 'GET',
                url: 'data/Grid.json',
                data: vm.user
            }).then(function (response) {
                vm.recordsTotal = response.data.recordsTotal;
                vm.users = response.data.data;
            });
        };

        vm.reset = function () {
            vm.user = {};
        };

        vm.query();
    }

    function BootstrapModalCtrl($uibModalInstance, items) {

        var vm = this;

        vm.user = items;

        vm.save = function () {
            $uibModalInstance.close(true);
        };

        vm.close = function () {
            $uibModalInstance.dismiss(0);
        };

    }

})();
