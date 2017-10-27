(function () {

    'use strict';

    /**
     * Using declared modules(使用getter的链式语法避免直接用一个变量导致出现变量冲突和泄漏问题)
     */
    angular
        .module('app.bootstrap.module')
        .controller('BootstrapCtrl', BootstrapCtrl)
        .controller('BootstrapModalCtrl', BootstrapModalCtrl);

    /* @ngInject */
    function BootstrapCtrl($uibModal, dialogService, $interval, $timeout, userService) {

        var vm = this;

        vm.pagination = {
            pageSizes: [10, 20, 50],
            pageSize: 10,
            currentPage: 1,
            maxSize: 8
        };

        vm.percentage = 0;
        /**
         * (1)定时操作
         * setInterval: 按指定的周期(以毫秒计)来不停地调用函数直到clearInterval()被调用或窗口被关闭
         * clearInterval: 取消由setInterval()设置的timeout
         *
         * (2)延迟操作
         * setTimeout: 在指定的毫秒数后调用函数
         * clearTimeou: 可取消由setTimeout()方法设置的timeout
         *
         * 提示：setTimeout()只执行一次而setInterval()可执行多次
         */
        var timer = $interval(function () {
            if (vm.percentage > 80) {
                if (vm.percentage > 95) {
                    $interval.cancel(timer);
                } else {
                    vm.percentage += Math.ceil(Math.random() * 2);
                }
            } else {
                vm.percentage += 5 * Math.ceil(Math.random() * 2);
            }
        }, 1000);

        var delay = $timeout(function () {
            query(function () {
                vm.percentage = 100;
                $timeout.cancel(delay);
            });
        }, 5000);

        vm.user = {};

        vm.edit = edit;
        vm.remove = remove;
        vm.view = view;
        vm.query = query;
        vm.reset = reset;

        function edit(row) {
            openModal({
                rowData: row,
                action: 'edit',
                disabled: false
            });
        }

        function remove(row) {
            dialogService.confirm('确认删除吗？', function (yes) {
                yes && console.info(row);
            });
        }

        function view(row) {
            openModal({
                rowData: row,
                action: 'view',
                disabled: true
            });
        }

        function query(callback) {
            userService.getUserList({
                param: vm.param,
                pageSize: vm.pagination.pageSize,
                currentPage: vm.pagination.currentPage
            }).then(function (response) {
                vm.users = response.data.items;
                vm.totalItems = response.data.totalItems;
                callback && callback(response);
            });
        }

        function openModal(params) {
            return $uibModal.open({
                templateUrl: 'edit.html',
                controller: 'BootstrapModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    items: function () {
                        return params;
                    }
                }
            });
        }

        function reset() {
            vm.user = {};
        }

    }

    /* @ngInject */
    function BootstrapModalCtrl($uibModalInstance, items) {

        var vm = this;

        vm.user = angular.copy(items.rowData);
        vm.action = items.action;

        vm.save = function () {
            $uibModalInstance.close(vm.user);
        };

        vm.close = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }

})();
