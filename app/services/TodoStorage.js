/**
 * Created by eversvik on 22.06.2015.
 */
/// <reference path='../_all.ts' />
var myApp;
(function (myApp) {
    'use strict';
    var TodoStorage = (function () {
        // dependencies would be injected here
        function TodoStorage() {
            console.log('todostorage');
        }
        TodoStorage.prototype.get = function () {
            //return [];
            return JSON.parse(localStorage.getItem(TodoStorage.STORAGE_ID) || '[]');
        };
        TodoStorage.prototype.put = function (todos) {
            localStorage.setItem(TodoStorage.STORAGE_ID, JSON.stringify(todos));
        };
        TodoStorage.STORAGE_ID = 'todos-angularjs';
        return TodoStorage;
    })();
    myApp.TodoStorage = TodoStorage;
})(myApp || (myApp = {}));
//# sourceMappingURL=TodoStorage.js.map