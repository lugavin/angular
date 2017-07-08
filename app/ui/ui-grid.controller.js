/*!
 * https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md
 */
(function () {

    'use strict';

    angular
        .module('app.ui.grid')
        .controller('MainCtrl', MainCtrl)
        .controller('ModalCtrl', ModalCtrl);

    function MainCtrl($scope, $uibModal, $log, i18nService) {

        i18nService.setCurrentLang('zh-cn');

        var data = [
            {id: 1001, name: 'iPad', quantity: 5, price: 500, totalPrice: 2500},
            {id: 1002, name: 'iPhone', quantity: 5, price: 1000, totalPrice: 5000},
            {id: 1003, name: 'iMac', quantity: 5, price: 2000, totalPrice: 10000}
        ];

        var vm = this;

        vm.gridOptions = {
            enableHorizontalScrollbar: false,
            enableVerticalScrollbar: true,
            enableRowSelection: true,
            multiSelect: false,
            enableSorting: true,
            enablePagination: true,
            enablePaginationControls: true,
            paginationPageSizes: [10, 15, 20],
            paginationCurrentPage: 1,
            paginationPageSize: 10,
            totalItems: 0,
            useExternalPagination: true,
            onRegisterApi: function (gridApi) {
                vm.gridApi = gridApi;
                vm.gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    if (newValue != oldValue) {
                        rowEntity.totalPrice = (rowEntity.quantity || 0) * (rowEntity.price || 0);
                    }
                });
            },
            columnDefs: [
                {
                    field: 'id',
                    displayName: '商品编号',
                    enableCellEdit: false,
                    visible: true,
                    enableColumnMenu: false
                },
                {
                    field: 'name',
                    displayName: '商品名称',
                    enableCellEdit: false,
                    enableColumnMenu: false
                },
                {
                    field: 'quantity',
                    displayName: '购买数量',
                    enableCellEdit: true,
                    type: 'number',
                    enableColumnMenu: false
                },
                {
                    field: 'price',
                    displayName: '商品单价',
                    enableCellEdit: false,
                    enableColumnMenu: false
                },
                {
                    field: 'totalPrice',
                    displayName: '商品总价',
                    enableCellEdit: false,
                    enableColumnMenu: false
                },
                {
                    field: 'action',
                    displayName: '操作',
                    cellTemplate: 'template',
                    enableCellEdit: false,
                    enableColumnMenu: false
                }
            ]
        };

        vm.gridOptions.data = data;

        vm.add = function () {
            var row = {id: 1004, name: 'iMac', quantity: 5, price: 2000, totalPrice: 10000};
            vm.gridOptions.data.push(row);
        };

        vm.edit = function () {
            var row = vm.gridApi.selection.getSelectedRows()[0];
            // row.name = row.name + '_';
            var rowData = angular.copy(row);
            rowData.name = rowData.name + '_';
            // angular.extend(row, rowData);
            angular.extend({}, row, rowData);
        };

        vm.delete = function () {
            var row = vm.gridApi.selection.getSelectedRows()[0];
            var index = vm.gridOptions.data.indexOf(row.entity);
            vm.gridOptions.data.splice(index, 1);
        };

        vm.view = function () {
            var row = vm.gridApi.selection.getSelectedRows()[0];
            modelView(row, {title: '查看商品', disabled: true});
        };

        vm.editRow = function (grid, row) {
            modelView(row.entity, {title: '修改商品', disabled: false});
        };

        var modelView = function (row, param) {
            $uibModal.open({
                templateUrl: 'edit.html',
                controller: 'ModalCtrl',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    items: function () {
                        return angular.extend({}, row, param);
                    }
                }
            });
        };

        vm.save = function () {
            var param = [];
            angular.forEach(vm.gridOptions.data, function (obj) {
                param.push(angular.extend({}, obj, {totalPrice: obj.quantity * obj.price}));
            });
            $log.info(vm.gridOptions.data);
            $log.info(param);
        };

    }

    function ModalCtrl($uibModalInstance, $log, items) {

        var vm = this;

        vm.item = items;

        vm.save = function () {
            $uibModalInstance.close(true);
        };

        vm.close = function () {
            $uibModalInstance.dismiss(0);
        };

    }

})();
