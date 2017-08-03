/*!
 * https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md
 */
(function () {

    'use strict';

    angular
        .module('app.grid.module')
        .filter('StatusFormatter', StatusFormatter)
        .controller('GridCtrl', GridCtrl)
        .controller('GridModalCtrl', GridModalCtrl);

    function StatusFormatter() {
        var map = {'0': '不可用', '1': '可用'};
        return function (input) {
            return map[input] || '';
        };
    }

    function GridCtrl($scope, $uibModal, $http, $log, i18nService, uiGridValidateService, uiGridConstants) {

        i18nService.setCurrentLang('zh-cn');

        /**
         * setValidator(name, validatorFactory, messageFunction)
         */
        uiGridValidateService.setValidator('minValue', function (argument) {
                return function (oldValue, newValue, rowEntity, colDef) {
                    return newValue >= argument;
                };
            }, function (argument) {
                return '你输入的值不能小于"' + argument + '"';
            }
        );

        var data = [
            {id: 1001, name: 'iPad', status: '1', quantity: 5, price: 500, subcost: 2500},
            {id: 1002, name: 'iPhone', status: '1', quantity: 5, price: 1000, subcost: 5000},
            {id: 1003, name: 'iMac', status: '1', quantity: 5, price: 2000, subcost: 10000}
        ];

        var vm = this;

        /**
         * https://github.com/angular-ui/ui-grid/wiki/Configuration-Options
         * https://github.com/angular-ui/ui-grid/wiki/Defining-columns
         */
        vm.gridOptions = {
            enableCellEditOnFocus: true,
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
            showColumnFooter: true,
            showGridFooter: false,
            // rowTemplate: '<div ng-dblclick="grid.appScope.ondblclick(grid, row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{\'ui-grid-row-header-cell\': col.isRowHeader}" ui-grid-cell></div>',
            // appScopeProvider: {
            //     ondblclick: function (grid, row) {
            //         console.info(row.entity);
            //     }
            // },
            enableCellEdit: false,
            cellEditableCondition: function () {
                return true;
            },
            onRegisterApi: function (gridApi) {
                vm.gridApi = gridApi;
                gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    if (newValue != oldValue) {
                        rowEntity.subcost = (rowEntity.quantity || 0) * (rowEntity.price || 0);
                    }
                });
                gridApi.validate.on.validationFailed($scope, function (rowEntity, colDef, newValue, oldValue) {
                    $log.info(rowEntity, colDef, newValue, oldValue);
                });
                gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                    $log.info(pageNumber, pageSize);
                });
            },
            columnDefs: [
                {
                    field: 'id',
                    displayName: '商品编号',
                    visible: true
                },
                {
                    field: 'name',
                    displayName: '商品名称'
                },
                {
                    field: 'status',
                    displayName: '状态',
                    visible: false,
                    cellFilter: 'StatusFormatter'
                },
                {
                    field: 'quantity',
                    displayName: '购买数量',
                    type: 'number',
                    cellClass: 'text-left',
                    enableCellEdit: true,
                    cellEditableCondition: function ($scope) {
                        return $scope.row.entity.isNew;
                    },
                    validators: {required: true, minValue: 1},
                    cellTemplate: 'ui-grid/cellTitleValidator',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    aggregationLabel: '购买总数量：'
                },
                {
                    field: 'price',
                    displayName: '商品单价',
                    cellClass: 'text-left'
                },
                {
                    field: 'subcost',
                    displayName: '小计',
                    cellClass: 'text-left',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    aggregationLabel: '购买总价：'
                },
                {
                    field: 'action',
                    displayName: '操作',
                    cellTemplate: 'template'
                }
            ]
        };

        vm.gridOptions.data = data;

        vm.add = function () {
            var row = {id: 1004, name: 'iMac', status: '0', quantity: 5, price: 2000, subcost: 10000, isNew: true};
            vm.gridOptions.data.push(row);
        };

        vm.edit = function () {
            var row = vm.gridApi.selection.getSelectedRows()[0];
            // row.name = row.name + '_';
            // var rowData = angular.copy(row);
            // rowData.name = rowData.name + '_';
            // angular.extend(row, rowData);
            // angular.extend({}, row, rowData);
            row && openModal(row, {parentCtrl: vm, title: '修改商品', disabled: false});
        };

        vm.remove = function () {
            var row = vm.gridApi.selection.getSelectedRows()[0];
            row && vm.gridOptions.data.splice(vm.gridOptions.data.indexOf(row), 1);
        };

        vm.view = function () {
            var row = vm.gridApi.selection.getSelectedRows()[0];
            row && openModal(row, {parentCtrl: vm, title: '查看商品', disabled: true});
        };

        vm.editRow = function (grid, row) {
            openModal(row.entity, {parentCtrl: vm, title: '修改商品', disabled: false});
        };

        vm.removeRow = function (grid, row) {
            var index = vm.gridOptions.data.indexOf(row.entity);
            vm.gridOptions.data.splice(index, 1);
        };

        vm.viewRow = function (grid, row) {
            openModal(row.entity, {parentCtrl: vm, title: '查看商品', disabled: true});
        };

        var openModal = function (row, param) {
            $uibModal.open({
                templateUrl: 'edit.html',
                controller: 'GridModalCtrl',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    items: function () {
                        return angular.extend({rowData: angular.copy(row)}, param);
                    }
                }
            });
        };

        vm.refresh = function () {
            $log.info('Refresh DataGrid...');
        };

    }

    function GridModalCtrl($uibModalInstance, $log, items) {

        var vm = this;

        vm.item = items.rowData;
        vm.parentCtrl = items.parentCtrl;
        vm.title = items.title;
        vm.disabled = items.disabled;

        vm.save = function () {
            $uibModalInstance.close(true);
            vm.parentCtrl.refresh();
        };

        vm.close = function () {
            $uibModalInstance.dismiss(0);
        }

    }

})();
