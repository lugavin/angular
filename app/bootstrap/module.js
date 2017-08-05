/*!
 * https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md
 * https://github.com/johnpapa/ng-demos
 */
(function () {

    'use strict';

    /**
     * Declare modules without a variable using the setter syntax.
     * 声明模块(每个独立子模块使用唯一的命名约定以避免命名冲突)
     */
    angular.module('app.bootstrap.module', [
        'ngAnimate',
        'ui.bootstrap'
    ]);

})();
