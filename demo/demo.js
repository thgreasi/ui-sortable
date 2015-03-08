/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../bower_components/DefinitelyTyped/angular-ui/angular-ui-sortable.d.ts" />
var myapp = angular.module('sortableApp', ['ui.sortable']);
function buildArray(name, size) {
    var i, array = [];
    for (i = 1; i <= size; i++) {
        var tmp = {
            text: name + ' ' + i,
            value: i
        };
        array.push(tmp);
    }
    return array;
}
myapp.controller('sortableController', function ($scope) {
    'use strict';
    $scope.list = buildArray('Item', 5);
    $scope.sortingLog = [];
    $scope.sortableOptions = {
        // called after a node is dropped
        stop: function (e, ui) {
            var itemScope = ui.item.scope();
            var logEntry = {
                ID: $scope.sortingLog.length + 1,
                Text: 'Moved element: ' + ui.item.sortable.model.text
            };
            $scope.sortingLog.push(logEntry);
        }
    };
    var isItFloating = $scope.sortableOptions['ui-floating'];
});
