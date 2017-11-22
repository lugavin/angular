/*!
 * @see {@link https://github.com/angular-ui/ui-grid.info/tree/gh-pages/release}
 */
(function () {

    'use strict';

    angular.module('app.grid.module', [
        'ui.grid',
        'ui.grid.edit',
        'ui.grid.validate',
        'ui.grid.selection',
        'ui.grid.pagination',
        'ui.grid.autoResize',
        'ui.grid.resizeColumns'
    ]);

    angular.module('app.grid.module')
        .config(config)
        .decorator('GridOptions', uiGridDecorator)
        .decorator('uiGridValidateService', uiGridValidateDecorator);

    /* @ngInject */
    function config($provide, i18nConstants) {

        i18nConstants.DEFAULT_LANG = 'zh-cn';

        // $provide.decorator('GridOptions', uiGridDecorator);
        // $provide.decorator('uiGridValidateService', uiGridValidateDecorator);
        // uiGridDecorator.$inject = ['$delegate'];
        // uiGridValidateDecorator.$inject = ['$delegate'];

    }

    /**
     * @see angular.module('ui.grid').factory('GridOptions')
     * @see {@link http://ui-grid.info/docs/#/api/ui.grid.class:GridOptions}
     */
    /* @ngInject */
    function uiGridDecorator($delegate, uiGridConstants) {
        var defaults = {
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableVerticalScrollbar: uiGridConstants.scrollbars.ALWAYS,
            enableColumnMenus: false,
            enableColumnResizing: true,
            multiSelect: false,
            enableCellEdit: false,
            // rowTemplate: '<div ng-dblclick="grid.appScope.ondblclick(grid, row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{\'ui-grid-row-header-cell\': col.isRowHeader}" ui-grid-cell></div>',
            // appScopeProvider: {
            //     ondblclick: function (grid, row) {
            //         console.info(row.entity);
            //     }
            // },
            // enableFiltering: false,
            // enableSorting: true,
            // enableRowSelection: true,
            // enableRowHeaderSelection: false,
            // enableMinHeightCheck: false,
            paginationPageSizes: [10, 20, 50],
            paginationPageSize: 10,
            paginationCurrentPage: 1
        };
        var gridOptions = angular.copy($delegate);
        gridOptions.initialize = function (options) {
            options = angular.extend({}, defaults, options);
            return $delegate.initialize(options);
        };
        return gridOptions;
    }

    /* @ngInject */
    function uiGridValidateDecorator($delegate) {

        var uiGridValidateService = angular.copy($delegate);

        var defaultMessage = '请输入有效的值';

        var validators = {
            min: {
                message: '你输入的值不能小于{0}',
                rule: function (argument) {
                    return function (oldValue, newValue, rowEntity, colDef) {
                        return newValue >= argument;
                    };
                }
            },
            max: {
                message: '你输入的值不能大于{0}',
                rule: function (argument) {
                    return function (oldValue, newValue, rowEntity, colDef) {
                        return newValue <= argument;
                    };
                }
            }
        };

        for (var name in validators) {
            if (validators.hasOwnProperty(name)) {
                uiGridValidateService.setValidator(name, validators[name].rule, applyMessage(validators[name].message || defaultMessage));
            }
        }

        return uiGridValidateService;

        function applyMessage(message) {
            return function (argument) {
                return format(message, argument);
            };
        }

        function format() {
            if (arguments.length == 0) {
                return '';
            }
            var str = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                str = str.replace(new RegExp('\\{' + (i - 1) + '\\}', 'gm'), arguments[i]);
            }
            return str;
        }

    }

})();
