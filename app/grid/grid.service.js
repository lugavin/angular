(function () {

    'use strict';

    angular
        .module('app.grid.module')
        .factory('dataService', dataService);

    /* @ngInject */
    function dataService($http, $log) {

        // 用this定义类的public属性和public方法
        var service = this;

        service.getDataList = getDataList;

        return service;

        // 用var定义类的private属性和private方法
        function getDataList() {
            return [
                {id: 1001, name: 'iPad', status: '1', quantity: 5, price: 500, subcost: 2500},
                {id: 1002, name: 'iPhone', status: '1', quantity: 5, price: 1000, subcost: 5000},
                {id: 1003, name: 'iMac', status: '1', quantity: 5, price: 2000, subcost: 10000}
            ];
        }

    }

})();