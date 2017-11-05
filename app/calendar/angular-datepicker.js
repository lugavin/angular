(function () {

    // Declare module
    angular.module("multiDatePicker", ["pasvaz.bindonce"]);

    // Use the declared module
    angular.module("multiDatePicker").directive("multiDatePicker", ["$compile", function ($compile) {

        var options = {
            mode: "simple",
            months: 1,
            start: null,
            filter: void 0,
            callback: void 0,
            markerTemplate: "{{ day.marker }}",
            template: '<div class="multi-picker__wrapper">'
            + '<span class="multi-picker__prev-month" ng-click="moveMonth(-1)">&lt;</span>'
            + '<div class="multi-picker__month" bindonce ng-repeat="month in months track by $index">'
            + '<div class="multi-picker__month-name" ng-bind="month.name"></div>'
            + '<table class="multi-picker-calendar">'
            + '<tr class="multi-picker-calendar__days"><th bindonce ng-repeat="day in month.weeks[1]" class="multi-picker-calendar__weekday" bo-text="day.date.format(\'dd\')\"></th></tr>'
            + '<tr bindonce ng-repeat="week in month.weeks">'
            + '<td bo-class="{\'multi-picker-calendar__day\': day, \'multi-picker-calendar__day--selected\': day.selected, \'multi-picker-calendar__day--disabled\': day.disabled, \'multi-picker-calendar__day--in-range\': day.inRange, \'multi-picker-calendar__day--marked\': day.marker}" ng-repeat="day in week track by $index" ng-click="select(day)">'
            + '<div class="multi-picker-calendar__day-wrapper" bo-text="day.date.date()"></div>'
            + '<div class="multi-picker-calendar__day-marker-wrapper"><div class="multi-picker-calendar__day-marker" ng-if="day.marker" ng-bind-template=""></div></div>'
            + '</td></tr></table></div>'
            + '<span class="multi-picker__next-month" ng-click="moveMonth(1)">&gt;</span></div>'
        };
        return {
            restrict: "AE",
            replace: true,
            template: '<div class="multi-picker__holder"></div>',
            scope: {
                model: '=ngModel',
                options: '=',
                markers: '=',
                after: '=',
                before: '=',
                rangeFrom: '=',
                rangeTo: '='
            },
            link: function ($scope, $element, $attrs) {

                $scope.moveMonth = function (step) {
                    $scope.options.start.add(step, 'month');
                    _prepare();
                };

                $scope.select = function (day) {
                    var ix;
                    if (!day.disabled) {
                        switch ($scope.options.mode) {
                            case "multiple":
                                if (day.selected) {
                                    ix = _indexOfMoment($scope.model, day.date, 'day');
                                    $scope.model.splice(ix, 1);
                                } else {
                                    $scope.model.push(moment(day.date));
                                }
                                break;
                            default:
                                $scope.model = day.date;
                        }
                        if ($scope.options.callback) {
                            $scope.options.callback(day.date);
                        }
                        return _prepare();
                    }
                };

                $scope.$watchCollection('markers', function (newMarkers, oldMarkers) {
                    _indexMarkers();
                    return _prepare();
                });

                _setup();

                _build();

                switch ($scope.options.mode) {
                    case "multiple":
                        $scope.$watchCollection('model', function (newVals, oldVals) {
                            return _prepare();
                        });
                        break;
                    case "simple":
                        $scope.$watch('model', function (newVal, oldVal) {
                            if (!moment.isMoment(newVal)) {
                                newVal = moment(newVal);
                            }
                            if (!oldVal || oldVal && !newVal.isSame(oldVal, 'day')) {
                                $scope.model = newVal;
                                if (oldVal) {
                                    $scope.options.start = moment(newVal);
                                }
                                return _prepare();
                            }
                        });
                }

                $scope.$watch('before', function (newVal, oldVal) {
                    if (newVal) {
                        if (!moment.isMoment(newVal)) {
                            newVal = moment(newVal);
                        }
                        if (!newVal.isSame(oldVal, 'day')) {
                            return _prepare();
                        }
                    }
                });

                return $scope.$watch('after', function (newVal, oldVal) {
                    if (newVal) {
                        if (!moment.isMoment(newVal)) {
                            newVal = moment(newVal);
                        }
                        if (!newVal.isSame(oldVal, 'day')) {
                            return _prepare();
                        }
                    }
                });

                function _bake() {
                    var domEl;
                    domEl = $compile(angular.element($scope.options.template))($scope);
                    return $element.append(domEl);
                }

                function _indexOfMoment(array, element, match) {
                    var key, value;
                    for (key in array) {
                        value = array[key];
                        if (element.isSame(value, match)) {
                            return key;
                        }
                    }
                    return -1;
                }

                function _indexMarkers() {
                    var marker;
                    if ($scope.markers) {
                        return $scope.markerIndex = (function () {
                            var _i, _len, _ref, _results;
                            _ref = $scope.markers;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                marker = _ref[_i];
                                _results.push(marker.day);
                            }
                            return _results;
                        })();
                    }
                }

                function _withinLimits(day, month) {
                    var withinLimits;
                    withinLimits = true;
                    if ($scope.before) {
                        withinLimits && (withinLimits = day.isSameOrBefore($scope.before, 'day'));
                    }
                    if ($scope.after) {
                        withinLimits && (withinLimits = day.isSameOrAfter($scope.after, 'day'));
                    }
                    return withinLimits;
                }

                function _getMarker(day) {
                    var ix;
                    ix = _indexOfMoment($scope.markerIndex, day, 'day');
                    if (ix > -1) {
                        return $scope.markers[ix].marker;
                    } else {
                        return void 0;
                    }
                }

                function _isSelected(day) {
                    switch ($scope.options.mode) {
                        case "multiple":
                            return _indexOfMoment($scope.model, day, 'day') > -1;
                        default:
                            return $scope.model && day.isSame($scope.model, 'day');
                    }
                }

                function _isInRange(day) {
                    if ($scope.options.rangeMode) {
                        if ($scope.options.rangeMode === "from") {
                            return moment.range($scope.model, $scope.before).contains(day) || day.isSame($scope.before, 'day');
                        } else {
                            return moment.range($scope.after, $scope.model).contains(day) || day.isSame($scope.after, 'day');
                        }
                    } else {
                        return false;
                    }
                }

                function _buildWeek(time, month) {
                    var days, filter, start;
                    days = [];
                    filter = true;
                    start = time.startOf('week');
                    days = [0, 1, 2, 3, 4, 5, 6].map(function (d) {
                        var day, withinLimits, withinMonth;
                        day = moment(start).add(d, 'days');
                        withinMonth = day.month() === month;
                        withinLimits = _withinLimits(day, month);
                        if ($scope.options.filter) {
                            filter = $scope.options.filter(day);
                        }
                        return {
                            date: day,
                            selected: _isSelected(day) && withinMonth,
                            inRange: _isInRange(day),
                            disabled: !(withinLimits && withinMonth && filter),
                            marker: withinMonth ? _getMarker(day) : void 0
                        };
                    });
                    return days;
                }

                function _buildMonth(time) {
                    var calendarEnd, calendarStart, start, w, weeks, weeksInMonth;
                    weeks = [];
                    calendarStart = moment(time).startOf('month');
                    calendarEnd = moment(time).endOf('month');
                    weeksInMonth = 5;
                    start = time.startOf('month');
                    weeks = (function () {
                        var _i, _results;
                        _results = [];
                        for (w = _i = 0; 0 <= weeksInMonth ? _i <= weeksInMonth : _i >= weeksInMonth; w = 0 <= weeksInMonth ? ++_i : --_i) {
                            _results.push(_buildWeek(moment(start).add(w, 'weeks'), moment(start).month()));
                        }
                        return _results;
                    })();
                    return {
                        weeks: weeks,
                        name: time.format("MMMM YYYY")
                    };
                }

                function _setup() {
                    var attr, dates, start, tempOptions, v, _ref;
                    tempOptions = {};
                    for (attr in options) {
                        v = options[attr];
                        tempOptions[attr] = v;
                    }
                    if ($scope.options) {
                        _ref = $scope.options;
                        for (attr in _ref) {
                            v = _ref[attr];
                            tempOptions[attr] = $scope.options[attr];
                        }
                    }
                    $scope.options = tempOptions;
                    switch ($scope.options.mode) {
                        case "multiple":
                            if ($scope.model && Array.isArray($scope.model) && $scope.model.length > 0) {
                                if ($scope.model.length === 1) {
                                    start = moment($scope.model[0]);
                                } else {
                                    dates = $scope.model.slice(0);
                                    start = moment(dates.sort().slice(-1)[0]);
                                }
                            } else {
                                $scope.model = [];
                            }
                            break;
                        default:
                            if ($scope.model) {
                                start = moment($scope.model);
                            }
                    }
                    $scope.options.start = $scope.options.start || start || moment().startOf('day');
                    if ($scope.rangeFrom) {
                        $scope.options.rangeMode = "from";
                    } else if ($scope.rangeTo) {
                        $scope.options.rangeMode = "to";
                    }
                    _indexMarkers();
                    return $scope.options.template = $scope.options.template.replace('ng-bind-template=""', 'ng-bind-template="' + $scope.options.markerTemplate + '"');
                }

                function _prepare() {
                    var m;
                    $scope.months = [];
                    return $scope.months = (function () {
                        var _i, _ref, _results;
                        _results = [];
                        for (m = _i = 0, _ref = $scope.options.months; 0 <= _ref ? _i < _ref : _i > _ref; m = 0 <= _ref ? ++_i : --_i) {
                            _results.push(_buildMonth(moment($scope.options.start).add(m, 'months')));
                        }
                        return _results;
                    })();
                }

                function _build() {
                    _prepare();
                    return _bake();
                }
            }
        };
    }
    ]);

}).call(this);