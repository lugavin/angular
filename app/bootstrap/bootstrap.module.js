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

        // 用var定义类的private属性和private方法
        const Type = {ALERT: 'alert', CONFIRM: 'confirm'};

        // 用this定义类的public属性和public方法
        var dialog = this;

        dialog.MsgType = {
            SUCCESS: 'success',
            ERROR: 'error',
            WARN: 'warn',
            QUESTION: 'question'
        };

        dialog.alert = alert;

        dialog.confirm = confirm;

        dialog.message = angular.noop;

        return dialog;

        function alert(msg, msgType, callback) {

            var args = Array.prototype.slice.call(arguments);
            msg = args.shift();
            if (typeof args[args.length - 1] === 'function') {
                callback = args.pop();
            }
            msgType = args.length > 0 ? args.shift() : null;

            var map = {
                success: {title: '成功提示', icon: 'fa fa-info-circle fa-2x'},
                error: {title: '失败提示', icon: 'fa fa-times-circle fa-2x'},
                warn: {title: '警告', icon: 'fa fa-warning fa-2x'},
                question: {title: '确认', icon: 'fa fa-question-circle fa-2x'}
            };

            console.info(map[msgType]);

            openModal(angular.extend({}, map[msgType] || {title: '提示消息', icon: ''}, {
                message: msg,
                callback: callback,
                type: Type.ALERT
            }));
        }

        function confirm(msg, callback) {
            openModal({
                title: '确认提示',
                icon: 'fa fa-question-circle fa-2x',
                message: msg,
                callback: callback,
                type: Type.CONFIRM
            });
        }

        function openModal(settings) {
            $uibModal.open({
                size: 'sm',
                keyboard: false,
                backdrop: 'static',
                template: '<div class="modal-body">' +
                              '<i class="{{vm.icon}}"></i>&nbsp;<strong class="h4">{{vm.title}}：{{vm.message}}</strong>' +
                          '</div>' +
                          '<div class="modal-footer">' +
                              '<button type="button" class="btn btn-sm btn-default" ng-click="vm.cancel()" ng-if="vm.type!=\'alert\'">取消</button>' +
                              '<button type="button" class="btn btn-sm btn-primary" ng-click="vm.confirm()">确定</button>' +
                          '</div>',
                controller: function ($uibModalInstance) {

                    var vm = this;

                    var callback = settings.callback;

                    vm.type = settings.type;
                    vm.icon = settings.icon;
                    vm.title = settings.title;
                    vm.message = settings.message;

                    vm.cancel = cancel;
                    vm.confirm = confirm;

                    function confirm() {
                        $uibModalInstance.close(settings);
                        callback && callback(true);
                    }

                    function cancel() {
                        $uibModalInstance.dismiss('cancel');
                        callback && callback(false);
                    }

                },
                controllerAs: 'vm'
            });
        }

    }

    /* @ngInject */
    function uibModalDecorator($delegate, $injector, $log, tokenService) {

        var defaults = {
            backdrop: 'static',
            keyboard: true,
            size: 'lg'
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
