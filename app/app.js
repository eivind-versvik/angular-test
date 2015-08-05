/**
 * Created by eversvik on 21.06.2015.
 */
/// <reference path='_all.ts' />
var Base;
(function (Base) {
    var Module = (function () {
        function Module(name, modules) {
            this.app = angular.module(name, modules);
        }
        Module.prototype.addController = function (name, controller) {
            this.app.controller(name, controller);
        };
        Module.prototype.addService = function (name, service) {
            this.app.service(name, service);
        };
        Module.prototype.addConfig = function (config) {
            this.app.config(config);
        };
        Module.prototype.addDirective = function (direc) {
            this.app.directive(direc);
        };
        return Module;
    })();
    Base.Module = Module;
})(Base || (Base = {}));
var myApp;
(function (_myApp) {
    'use strict';
    var myApp = new Base.Module('myApp', ['ngRoute', 'myApp.version', 'isteven-multi-select']);
    myApp.addService('todoStorage', _myApp.TodoStorage);
    // myApp.addDirective('isteven-multi-select');
    myApp.addConfig(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: _myApp.SipEventCtrl
        });
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: _myApp.TodoCtrl
        });
    }]);
})(myApp || (myApp = {}));
//# sourceMappingURL=app.js.map