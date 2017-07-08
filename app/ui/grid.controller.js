/*!
 * https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md
 */
(function () {

    'use strict';

    angular
        .module('app.grid.module')
        .controller('GridCtrl', ['$scope', '$http', '$uibModal', '$log', 'i18nService', 'uiGridConstants', GridCtrl])
        .controller('GridModalCtrl', ['$uibModalInstance', 'items', GridModalCtrl]);

    function GridCtrl($scope, $http, $uibModal, $log, i18nService, uiGridConstants) {

        i18nService.setCurrentLang('zh-cn');

        var data = [
            {id: 1001, name: 'iPad', quantity: 5, price: 500, subcost: 2500},
            {id: 1002, name: 'iPhone', quantity: 5, price: 1000, subcost: 5000},
            {id: 1003, name: 'iMac', quantity: 5, price: 2000, subcost: 10000}
        ];

        var vm = this;

        /**
         * https://github.com/angular-ui/ui-grid/wiki/Configuration-Options
         * https://github.com/angular-ui/ui-grid/wiki/Defining-columns
         */
        vm.gridOptions = {
            enableHorizontalScrollbar: false,
            enableVerticalScrollbar: true,
            enableRowSelection: true,
            multiSelect: false,
            enableSorting: true,
            enablePagination: true,
            enablePaginationControls: true,
            paginationPageSizes: [10, 20, 50, 100],
            paginationPageSize: 10,
            paginationCurrentPage: 1,
            totalItems: 0,
            useExternalPagination: true,
            enableFiltering: false,
            showGridFooter: false,
            showColumnFooter: true,
            onRegisterApi: function (gridApi) {
                vm.gridApi = gridApi;
                vm.gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    if (newValue != oldValue) {
                        rowEntity.subcost = (rowEntity.quantity || 0) * (rowEntity.price || 0);
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
                    type: 'number',
                    cellClass: 'text-left',
                    enableCellEdit: true,
                    enableColumnMenu: false,
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    aggregationLabel: '购买总数量：'
                },
                {
                    field: 'price',
                    displayName: '商品单价',
                    cellClass: 'text-left',
                    enableCellEdit: false,
                    enableColumnMenu: false
                },
                {
                    field: 'subcost',
                    displayName: '小计',
                    cellClass: 'text-left',
                    enableCellEdit: false,
                    enableColumnMenu: false,
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    aggregationLabel: '购买总价：'
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
            var row = {id: 1004, name: 'iMac', quantity: 5, price: 2000, subcost: 10000};
            vm.gridOptions.data.push(row);
        };

        vm.edit = function () {
            var row = vm.gridApi.selection.getSelectedRows()[0];
            // row.name = row.name + '_';
            // var rowData = angular.copy(row);
            // rowData.name = rowData.name + '_';
            // angular.extend(row, rowData);
            // angular.extend({}, row, rowData);
            row && openModal(row, {title: '修改商品', disabled: false});
        };

        vm.remove = function () {
            var row = vm.gridApi.selection.getSelectedRows()[0];
            row && vm.gridOptions.data.splice(vm.gridOptions.data.indexOf(row.entity), 1);
        };

        vm.view = function () {
            var row = vm.gridApi.selection.getSelectedRows()[0];
            row && openModal(row, {title: '查看商品', disabled: true});
        };

        vm.editRow = function (grid, row) {
            openModal(row.entity, {title: '修改商品', disabled: false});
        };

        vm.removeRow = function (grid, row) {
            var index = vm.gridOptions.data.indexOf(row);
            vm.gridOptions.data.splice(index, 1);
        };

        vm.viewRow = function (grid, row) {
            openModal(row.entity, {title: '查看商品', disabled: true});
        };

        var openModal = function (row, param) {
            $uibModal.open({
                templateUrl: 'edit.html',
                controller: 'GridModalCtrl',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    items: function () {
                        return angular.extend({}, row, param);
                    }
                }
            });
        };

    }

    function GridModalCtrl($uibModalInstance, items) {

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
