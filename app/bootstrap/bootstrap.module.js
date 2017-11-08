(function () {

    'use strict';

    /**
     * Declare modules without a variable using the setter syntax.
     * 声明模块(每个独立子模块使用唯一的命名约定以避免命名冲突)
     */
    angular.module('app.bootstrap.module', [
        'ui.bootstrap',
        'app.service'
    ]).decorator('$uibModal', uibModalDecorator)
        .factory('userService', userService)
        .factory('dialogService', dialogService)
        .factory('NProgress', NProgress)
        .directive('tree', treeDirective);

    /* @ngInject */
    function treeDirective($compile) {
        return {
            restrict: 'AE',
            scope: {
                ngModel: '=?',
                tree: '='
            },
            transclude: true,
            replace: true,
            link: function (scope, element, attrs, ctrls) {

                var defaults = {
                    rootPid: null,
                    pidKey: 'pid',
                    idKey: 'id',
                    checkbox: false,
                    url: null,
                    data: [],
                    onClick: function (node) {
                    },
                    onDblClick: function (node) {
                    }
                };

                var settings = angular.extend({}, defaults, scope.tree);

                scope.ngModel = scope.ngModel || [];

                var data = [
                    {id: '1001', pid: null, name: 'xxx'},
                    {id: '1002', pid: '1001', name: 'yyy'},
                    {id: '1003', pid: '1001', name: 'zzz'},
                    {id: '1004', pid: '1003', name: 'qqq'}
                ];
                // if (Array.isArray(settings.data)) {
                //     data = settings.data;
                // } else if (typeof(settings.data) === 'string') {
                //     data = JSON.parse(settings.data);
                // }

                var nodeArr = group(data, settings.pidKey);

                var rootNodes = nodeArr[settings.rootPid];
                iterator(rootNodes);

                var tree = buildTreeNode(rootNodes);

                element.empty().append($compile(tree)(scope));

                /**
                 * <i class="fa fa-folder-o"></i>
                 * <i class="fa fa-folder-open-o"></i>
                 * <i class="fa fa-folder"></i>
                 * <i class="fa fa-folder-open"></i>
                 *
                 * <i class="fa fa-square-o"></i>
                 * <i class="fa fa-minus-square-o"></i>
                 * <i class="fa fa-check-square-o"></i>
                 */
                function buildTreeNode(treeNodes) {

                    if (!treeNodes || !treeNodes.length) {
                        return;
                    }

                    var ulNode = angular.element('<ul></ul>').addClass('tree');

                    treeNodes.forEach(function (node) {

                        var treeNode = angular.element('<div class="tree-node"></div>');

                        // collapsed expanded
                        var stateNode = angular.element('<i class="fa fa-folder-open-o"></i>&nbsp;');
                        stateNode.on('click', function () {
                            var $this = angular.element(this);
                            if ($this.hasClass('fa-folder-open-o')) {
                                $this.removeClass('fa-folder-open-o');
                                $this.addClass('fa-folder-o');
                            } else {
                                $this.removeClass('fa-folder-o');
                                $this.addClass('fa-folder-open-o');
                            }
                        });

                        treeNode.append(stateNode);

                        // checked unchecked
                        if (settings.checkbox) {
                            var checkNode = angular.element('<i class="fa fa-square-o"></i>&nbsp;');
                            checkNode.on('click', function () {
                                var $this = angular.element(this);
                                if ($this.hasClass('fa-square-o')) {
                                    $this.removeClass('fa-square-o');
                                    $this.addClass('fa-check-square-o');
                                } else {
                                    $this.removeClass('fa-check-square-o');
                                    $this.addClass('fa-square-o');
                                }
                            });

                            treeNode.append(checkNode);
                        }
                        var aNode = angular.element('<a href="javascript:void(0)"></a>');
                        aNode.text(node.name);
                        treeNode.append(aNode);

                        var subNodes = nodeArr[node[settings.idKey]];
                        var liNode = angular.element('<li></li>');
                        liNode.append(treeNode);
                        liNode.append(buildTreeNode(subNodes));
                        ulNode.append(liNode);
                    });

                    return ulNode;
                }

                function setParentCheckbox(node){
                    var pnode = getParentNode(target, node[0]);
                    if (pnode){
                        var ck = $(pnode.target).find('.tree-checkbox');
                        ck.removeClass('tree-checkbox0 tree-checkbox1 tree-checkbox2');
                        if (isAllSelected(node)){
                            ck.addClass('tree-checkbox1');
                        } else if (isAllNull(node)){
                            ck.addClass('tree-checkbox0');
                        } else {
                            ck.addClass('tree-checkbox2');
                        }
                        setParentCheckbox($(pnode.target));
                    }

                    function isAllSelected(n){
                        var ck = n.find('.tree-checkbox');
                        if (ck.hasClass('tree-checkbox0') || ck.hasClass('tree-checkbox2')) return false;
                        var b = true;
                        n.parent().siblings().each(function(){
                            if (!$(this).find('.tree-checkbox').hasClass('tree-checkbox1')){
                                b = false;
                            }
                        });
                        return b;
                    }
                    function isAllNull(n){
                        var ck = n.find('.tree-checkbox');
                        if (ck.hasClass('tree-checkbox1') || ck.hasClass('tree-checkbox2')) return false;
                        var b = true;
                        n.parent().siblings().each(function(){
                            if (!$(this).find('.tree-checkbox').hasClass('tree-checkbox0')){
                                b = false;
                            }
                        });
                        return b;
                    }
                }

                function expandNode(target, node){

                }

                function collapseNode(target, node) {

                    var hit = $('>span.tree-hit', node);
                    if (hit.length == 0) {  // is a leaf node
                        return;
                    }

                    if (hit.hasClass('tree-expanded')) {
                        hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
                        hit.next().removeClass('tree-folder-open');
                        if (opts.animate) {
                            $(node).next().slideUp();
                        } else {
                            $(node).next().css('display', 'none');
                        }
                    }
                }

                /**
                 * 分组后进行迭代
                 */
                function iterator(rootNodes) {
                    if (!rootNodes || !rootNodes.length) {
                        return;
                    }
                    rootNodes.forEach(function (rootNode) {
                        rootNode.children = nodeArr[rootNode[settings.idKey]] || [];
                        iterator(rootNode.children);
                    });
                }

                /**
                 * 分组
                 */
                function group(dataArr, pidKey) {
                    var nodeMap = {};
                    dataArr.forEach(function (obj) {
                        if (!nodeMap[obj[pidKey]]) {
                            nodeMap[obj[pidKey]] = [];
                        }
                        nodeMap[obj[pidKey]].push(obj);
                    });
                    return nodeMap;
                }

            }
        };
    }

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
