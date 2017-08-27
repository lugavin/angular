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
        .factory('userService', userService)
        .factory('dialogService', dialogService)
        .factory('NProgress', NProgress);

    /* @ngInject */
    function uibModalDecorator($delegate, tokenService, $log) {

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
                // $log.debug('modal opened');
                var promise = tokenService.genSubmitToken();
                promise.then(function (response) {
                    $log.debug('Submit-Token: ' + response.data['Submit-Token']);
                });
            });
            modalInstance.rendered.then(function () {
                // $log.debug('modal rendered');
            });
            modalInstance.closed.then(function () {
                // $log.debug('modal closed');
            });
            modalInstance.result.then(function (result) {
                $log.debug('Call => $uibModalInstance.close(result)');
            }, function (reason) {
                $log.debug('Call => $uibModalInstance.dismiss(reason)');
            });

            return modalInstance;
        };

        return modal;
    }

    /* @ngInject */
    function userService($q, $http) {

        var servic = this;

        servic.getUserList = getUserList;

        return servic;

        function getUserList(params) {

            var deferred = $q.defer();

            $http({
                url: 'data/Grid.json',
                data: params
            }).then(function (response) {
                deferred.resolve(response);
            }, function (rejection) {
                deferred.reject(rejection);
            });

            return deferred.promise;
        }
    }

    /* @ngInject */
    function dialogService($uibModal) {

        // 用var定义类的private属性和private方法
        var DialogType = {ALERT: 'alert', CONFIRM: 'confirm'};
        var Type = {SUCCESS: 'success', ERROR: 'error', WARN: 'warn', QUESTION: 'question'};

        // 用this定义类的public属性和public方法
        var dialog = this;

        dialog.alert = alert;
        dialog.confirm = confirm;
        dialog.message = angular.noop;

        return dialog;

        function alert(msg, type, callback) {

            var args = Array.prototype.slice.call(arguments);
            msg = args.shift();
            if (typeof args[args.length - 1] === 'function') {
                callback = args.pop();
            }
            type = args.length > 0 ? args.shift() : null;

            var msgType = {
                success: {title: '成功提示', icon: 'fa fa-info-circle fa-2x'},
                error: {title: '失败提示', icon: 'fa fa-times-circle fa-2x'},
                warn: {title: '警告', icon: 'fa fa-warning fa-2x'},
                question: {title: '确认', icon: 'fa fa-question-circle fa-2x'}
            };

            openModal(angular.extend({}, msgType[type] || {title: '提示消息', icon: ''}, {
                message: msg,
                callback: callback,
                type: DialogType.ALERT
            }));
        }

        function confirm(msg, callback) {
            openModal({
                title: '确认提示',
                icon: 'fa fa-question-circle fa-2x',
                message: msg,
                callback: callback,
                type: DialogType.CONFIRM
            });
        }

        function openModal(settings) {
            $uibModal.open({
                size: 'sm',
                keyboard: false,
                backdrop: 'static',
                template: '<div class="modal-body"><i class="{{vm.icon}}"></i>&nbsp;<strong class="h4">{{vm.title}}：{{vm.message}}</strong></div>' +
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
    function NProgress($interval, $uibModal) {

        var NProgress = this;

        var modalInstances = [];

        NProgress.start = start;
        NProgress.done = done;

        return NProgress;


        function start() {
            var modalInstance = $uibModal.open({
                size: 'lg',
                keyboard: false,
                backdrop: 'static',
                template: '<div class="modal-body"><uib-progressbar class="progress-striped" type="primary" ng-class="{active: vm.percentage!=100}" max="100" value="vm.percentage"><i>{{vm.percentage}}%</i></uib-progressbar></div>',
                controller: function () {
                    var vm = this;
                    vm.percentage = 0;
                    var timer = $interval(function () {
                        if (vm.percentage > 80) {
                            if (vm.percentage > 95) {
                                $interval.cancel(timer);
                            } else {
                                vm.percentage += Math.ceil(Math.random() * 2);
                            }
                        } else {
                            vm.percentage += 5 * Math.ceil(Math.random() * 2);
                        }
                    }, 1000);
                },
                controllerAs: 'vm'
            });
            modalInstances.push(modalInstance);
        }

        function done() {
            var modalInstance = modalInstances.pop();
            modalInstance && modalInstance.close('done');
        }

    }

})();
