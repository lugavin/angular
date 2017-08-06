(function () {

    'use strict';

    angular
        .module('app.grid.module')
        .controller('GridCtrl', GridCtrl)
        .controller('GridModalCtrl', GridModalCtrl);

    /* @ngInject */
    function GridCtrl($scope, $uibModal, $log, uiGridValidateService, uiGridConstants, dataService) {

        var vm = this;

        vm.query = query;
        vm.reset = reset;

        vm.add = add;
        vm.edit = edit;
        vm.view = view;
        vm.remove = remove;
        vm.refresh = refresh;
        vm.editRow = editRow;
        vm.removeRow = removeRow;
        vm.viewRow = viewRow;

        vm.gridOptions = {
            showColumnFooter: true,
            onRegisterApi: function (gridApi) {
                vm.gridApi = gridApi;
                gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                    $log.info(pageNumber, pageSize);
                });
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    $log.info(row);
                });
                gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    if (newValue != oldValue) {
                        rowEntity.subcost = (rowEntity.quantity || 0) * (rowEntity.price || 0);
                    }
                });
                gridApi.validate.on.validationFailed($scope, function (rowEntity, colDef, newValue, oldValue) {
                    $log.info(uiGridValidateService.getErrorMessages(rowEntity, colDef));
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
                    field: 'price',
                    displayName: '商品单价',
                    cellClass: 'text-left'
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
                    validators: {required: true, min: 1, max: 999},
                    cellTemplate: 'ui-grid/cellTitleValidator',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    aggregationLabel: '合计：'
                },
                {
                    field: 'subcost',
                    displayName: '小计',
                    cellClass: 'text-left',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    aggregationLabel: '合计：'
                },
                {
                    field: 'action',
                    displayName: '操作',
                    cellTemplate: 'template'
                }
            ]
        };

        dataService.synchData().then(function (response) {
            vm.gridOptions.data = dataService.getDataList();
        });

        function query() {
            var rows = vm.gridOptions.data;
            for (var i = 0; i < rows.length; i++) {
                var obj = rows[i];
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop) && obj.hasOwnProperty('$$invalid' + prop)) {
                        return $log.debug('Validation Failed: ' + prop + ' => ' + obj[prop]);
                    }
                }
            }
            $log.debug('Validation Successful.');
        }

        function reset() {
            vm.product = {};
        }

        function add() {
            var row = {id: 1004, name: 'iMac', status: '0', quantity: 5, price: 2000, subcost: 10000, isNew: true};
            vm.gridOptions.data.push(row);
        }

        function edit() {
            var row = vm.gridApi.selection.getSelectedRows()[0];
            // row.name = row.name + '_';
            // var rowData = angular.copy(row);
            // rowData.name = rowData.name + '_';
            // angular.extend(row, rowData);
            // angular.extend({}, row, rowData);
            row && openModal(row, {action: 'edit', disabled: false});
        }

        function remove() {
            var row = vm.gridApi.selection.getSelectedRows()[0];
            row && vm.gridOptions.data.splice(vm.gridOptions.data.indexOf(row), 1);
        }

        function view() {
            var row = vm.gridApi.selection.getSelectedRows()[0];
            row && openModal(row, {action: 'view', disabled: true});
        }

        function editRow(grid, row) {
            openModal(row.entity, {action: 'edit', disabled: false});
        }

        function removeRow(grid, row) {
            var index = vm.gridOptions.data.indexOf(row.entity);
            vm.gridOptions.data.splice(index, 1);
        }

        function viewRow(grid, row) {
            openModal(row.entity, {action: 'view', disabled: true});
        }

        function refresh() {
            $log.debug('Refresh DataGrid...');
        }

        function openModal(row, param) {
            $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                templateUrl: 'edit.html',
                controller: 'GridModalCtrl',
                controllerAs: 'vm',
                scope: $scope,
                resolve: {
                    items: function () {
                        return angular.extend({rowData: angular.copy(row)}, param);
                    }
                }
            });
        }

    }

    /* @ngInject */
    function GridModalCtrl($scope, $uibModalInstance, $log, items, dataService) {

        var vm = this;

        vm.save = save;
        vm.close = close;

        vm.item = items.rowData;
        vm.action = items.action;
        vm.disabled = items.disabled;

        function save() {
            $uibModalInstance.close(true);
            $scope.$parent.vm.refresh();
        }

        function close() {
            $uibModalInstance.dismiss(0);
        }

    }

})();
