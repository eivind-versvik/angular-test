/**
 * Created by eversvik on 28.07.2015.
 */
/// <reference path='../_all.ts' />
var myApp;
(function (myApp) {
    'use strict';
    var SipEventKey = (function () {
        function SipEventKey() {
        }
        return SipEventKey;
    })();
    myApp.SipEventKey = SipEventKey;
    var SipEventEndpoint = (function () {
        function SipEventEndpoint() {
            this.state = [];
        }
        return SipEventEndpoint;
    })();
    myApp.SipEventEndpoint = SipEventEndpoint;
    var SipEventCondition = (function () {
        function SipEventCondition() {
            this.endpoint = new SipEventEndpoint();
            this.key = new SipEventKey();
        }
        SipEventCondition.prototype.clear = function (type) {
            console.log('clearing ' + type);
            if (type != 'key')
                delete this.key;
            if (type != 'endpoint')
                delete this.endpoint;
        };
        return SipEventCondition;
    })();
    myApp.SipEventCondition = SipEventCondition;
    var SipEventCfg = (function () {
        function SipEventCfg() {
            this.condition = new SipEventCondition();
        }
        SipEventCfg.prototype.dosomething = function () {
            console.log('Adding SipEventCfg');
            console.log(JSON.stringify(this));
        };
        SipEventCfg.prototype.clear = function (type) {
            this.condition.clear(type);
        };
        return SipEventCfg;
    })();
    myApp.SipEventCfg = SipEventCfg;
    /**
     * event_rules { rule = [ name string, condition = {}, restriction = [], action = [] ] }
     */
    /**
     * The main controller for the app. The controller:
     * - retrieves and persists the model via the todoStorage service
     * - exposes the model to the template and provides event handlers
     */
    var SipEventCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function SipEventCtrl($scope) {
            this.$scope = $scope;
            console.log('SipEventCtrl Constructor');
            this.newevent = new SipEventCfg();
            this.eventType = 'endpoint';
            // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
            // for its methods to be accessible from view / HTML
            $scope.vm = this;
            this.modernBrowsers = [
                { name: "Not Registered", data: "not_registered", ticked: false },
                { name: "Idle", data: "idle", ticked: false },
                { name: "In Call", data: "in_call", ticked: false },
            ];
            // watching for events/changes in scope, which are caused by view/user input
            // if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
            //$scope.$watch('eventType', () => this.onChangedType(), true);
            //$scope.$watch('location.path()', path => this.onPath(path))
            //if ($location.path() === '') $location.path('/');
            //$scope.location = $location;
        }
        SipEventCtrl.prototype.addNewEvent = function () {
            this.newevent.clear(this.eventType);
            this.newevent.dosomething();
        };
        SipEventCtrl.prototype.addUniqeArrayItem = function (array, item) {
            if (item == null || item == "")
                return;
            for (var i = 0, l = array.length; i < l; i++) {
                if (array[i] == item)
                    return;
            }
            //console.log(item);
            array.push(item);
            console.log(array);
        };
        // $inject annotation.
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        SipEventCtrl.$inject = [
            '$scope'
        ];
        return SipEventCtrl;
    })();
    myApp.SipEventCtrl = SipEventCtrl;
})(myApp || (myApp = {}));
//# sourceMappingURL=SipEventCtrl.js.map