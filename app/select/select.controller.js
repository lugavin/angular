(function () {

    'use strict';

    angular
        .module('app.select.module')
        .directive('uiSelectWrap', uiSelectWrap)
        .controller('SelectCtrl', SelectCtrl)
        .filter('propsFilter', propsFilter)
        .filter('couponFormatter', couponFormatter);

    /* @ngInject */
    function SelectCtrl($scope, $uibModal, $http, $log, i18nService, uiGridConstants) {

        i18nService.setCurrentLang('zh-cn');

        var data = [
            {id: 1001, name: 'iPad', status: '1', quantity: 5, price: 500, subcost: 2500},
            {id: 1002, name: 'iPhone', status: '1', quantity: 5, price: 1000, subcost: 5000},
            {id: 1003, name: 'iMac', status: '1', quantity: 5, price: 2000, subcost: 10000}
        ];

        var vm = this;

        vm.items = [];
        vm.dropdownOptions = [];

        vm.refreshItems = refreshItems;
        vm.selectItem = selectItem;
        vm.asyncGridItem = asyncGridItem;
        vm.selectGridItem = selectGridItem;

        vm.reset = reset;

        /**
         * https://github.com/angular-ui/ui-grid/wiki/Configuration-Options
         * https://github.com/angular-ui/ui-grid/wiki/Defining-columns
         */
        vm.gridOptions = {
            showColumnFooter: true,
            onRegisterApi: function (gridApi) {
                vm.gridApi = gridApi;
                gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    if (newValue != oldValue) {
                        rowEntity.subcost = (rowEntity.quantity || 0) * (rowEntity.price || 0);
                    }
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
                    field: 'cid',
                    displayName: '优惠券编号',
                    visible: false
                },
                {
                    field: 'cdesc',
                    displayName: '优惠券描述',
                    visible: false
                },
                {
                    field: 'coupon',
                    displayName: '优惠券',
                    enableCellEdit: true,
                    // editableCellTemplate: 'ui-grid/dropdownEditor',
                    // editDropdownOptionsArray: dropdownOptions,
                    editableCellTemplate: 'dropdownEditor.html',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'text',
                    cellFilter: 'couponFormatter:this'
                },
                {
                    field: 'quantity',
                    displayName: '购买数量',
                    type: 'number',
                    cellClass: 'text-danger',
                    enableCellEdit: true,
                    validators: {required: true, min: 1, max: 999},
                    cellTemplate: 'ui-grid/cellTitleValidator',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    aggregationLabel: '合计：'
                },
                {
                    field: 'price',
                    displayName: '商品单价'
                },
                {
                    field: 'subcost',
                    displayName: '小计',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    aggregationLabel: '合计：'
                }
            ]
        };

        vm.gridOptions.data = data;

        function refreshItems(item) {
            return $http.get('data/Select.json', {keyword: item.text}).then(function (response) {
                vm.items = response.data;
            });
        }

        function selectItem($item, $model) {
            $log.info($item, $model);
        }

        function asyncGridItem(item) {
            return $http.get('data/Select.json', {keyword: item.text}).then(function (response) {
                vm.dropdownOptions = response.data;
            });
        }

        function selectGridItem($item, $model, grid, row) {
            row.entity.cid = $item.id;
            row.entity.cdesc = $item.text;
            $log.debug(row.entity);
        }

        function reset() {
            vm.coupon = {};
        }

    }

    /* @ngInject */
    function uiSelectWrap($document, uiGridEditConstants) {
        return {
            link: function ($scope, $element, $attr) {

                $document.on('click', clickFn);

                function clickFn($event) {
                    if (!$event.target.closest('.ui-select-container')) {
                        $scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
                        $document.off('click', clickFn);
                    }
                }
            }

        };
    }

    function propsFilter() {
        return function (items, props) {
            var out = [];
            if (angular.isArray(items)) {
                var keys = Object.keys(props);
                items.forEach(function (item) {
                    var itemMatches = false;
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }
                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                out = items;
            }
            return out;
        };
    }

    function couponFormatter() {
        return function (input, context) {
            input = input || {};
            // var initial = context.row.entity[context.col.field];
            // var idField = context.col.colDef.editDropdownIdLabel;
            var valueField = context.col.colDef.editDropdownValueLabel;
            return input[valueField] || '';
        }
    }

})();
