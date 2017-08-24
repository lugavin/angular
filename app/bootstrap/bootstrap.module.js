(function () {

    'use strict';

    /**
     * Declare modules without a variable using the setter syntax.
     * 声明模块(每个独立子模块使用唯一的命名约定以避免命名冲突)
     */
    angular.module('app.bootstrap.module', [
        'ngAnimate',
        'ui.bootstrap',
        'app.service'
    ]).decorator('$uibModal', uibModalDecorator);

    /* @ngInject */
    function uibModalDecorator($delegate, $injector, $log, tokenService) {

        var defaults = {
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            resolve: {
                items: angular.noop
            },
            appendTo: angular.element(document).find('body').eq(0)
        };

        var modal = angular.copy($delegate);

        modal.open = function (options) {

            options = angular.extend({}, defaults, options);

            var modalInstance = $delegate.open(options);

            modalInstance.opened.then(function () {
                $log.debug('modal opened');
                var promise = tokenService.genSubmitToken();
                promise.then(function (response) {
                    $log.debug('Submit-Token: ' + response.data['Submit-Token']);
                });
            });

            modalInstance.rendered.then(function () {
                $log.debug('modal rendered');
            });

            modalInstance.closed.then(function () {
                $log.debug('modal closed');
            });

            modalInstance.result.then(function (result) {
                // success: $uibModalInstance.close(result)
                $log.debug(result);
            }, function (reason) {
                // error or cancel: $uibModalInstance.dismiss(reason);
                $log.debug(reason);
            });

            return modalInstance;
        };

        return modal;
    }

})();
