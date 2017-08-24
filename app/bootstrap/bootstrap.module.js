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
    ]).decorator('$uibModal', uibModalDecorator)
        .factory('dialogService', dialogService);

    /* @ngInject */
    function dialogService($uibModal) {

        // 用this定义类的public属性和public方法
        // 用var定义类的private属性和private方法
        var service = this;

        service.alert = function(message, callback) {
            openModal({
                message: message,
                callback: callback
            });
        };
        service.confirm = angular.noop;
        service.message = angular.noop;

        return service;

        function openModal(options) {
            $uibModal.open({
                template: '<div class="modal-header bg-primary">{{vm.title}}</div>' +
                          '<div class="modal-body">{{vm.message}}</div>' +
                          '<div class="modal-footer">' +
                              '<button type="button" class="btn btn-sm btn-default" ng-click="vm.cancel()">取消</button>' +
                              '<button type="button" class="btn btn-sm btn-primary" ng-click="vm.confirm()">确定</button>' +
                          '</div>',
                controller: function ($uibModalInstance, items) {

                    var vm = this;

                    var callback = items.callback || angular.noop;

                    vm.title = items.title || '';
                    vm.message = items.message || '';

                    vm.cancel = cancel;
                    vm.confirm = confirm;

                    function confirm() {
                        callback && callback();
                        $uibModalInstance.close(items);
                    }

                    function cancel() {
                        $uibModalInstance.dismiss('cancel');
                    }

                },
                controllerAs: 'vm',
                resolve: {
                    items: function () {
                        return options;
                    }
                }
            });
        }

    }

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
