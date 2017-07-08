/*!
 * https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md
 */
(function () {

    'use strict';

    angular
        .module('app.ui.grid')
        .controller('MainCtrl', MainCtrl);

    function MainCtrl($log, i18nService) {

        var data = [
            {id: 1001, name: 'iPad', quantity: 5, price: 500},
            {id: 1002, name: 'iPhone', quantity: 5, price: 1000},
            {id: 1003, name: 'iMac', quantity: 5, price: 2000}
        ];

        var vm = this;

        i18nService.setCurrentLang('zh-cn');

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
                    field: 'getTotalPrice()',
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

        angular.forEach(data, function (obj) {
            angular.extend(obj, {
                getTotalPrice: function () {
                    return this.quantity * this.price;
                }
            });
        });

        vm.gridOptions.data = data;

        vm.add = function () {
            vm.gridOptions.data.push({
                id: 1003,
                name: 'iMac',
                quantity: 5,
                price: 2000,
                getTotalPrice: function () {
                    return this.quantity * this.price;
                }
            });
        };

        vm.view = function () {
            var row = vm.gridApi.selection.getSelectedRows()[0];
            // row.name = row.name + '_';
            var rowData = angular.copy(row);
            rowData.name = rowData.name + '_';
            // angular.extend(row, rowData);
            angular.extend({}, row, rowData);
        };

        vm.editRow = function (grid, row) {
            $log.info(grid);
            $log.info(row.entity);
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

})();
