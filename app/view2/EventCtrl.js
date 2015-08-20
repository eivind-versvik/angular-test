/**
 * Created by eversvik on 28.07.2015.
 */
/// <reference path='../_all.ts' />
var myApp;
(function (myApp) {
    'use strict';
    var MultiSelect = (function () {
        function MultiSelect(defaultText) {
            this.langState = {};
            this.langState.nothingSelected = defaultText;
            this.langState.search = 'Search';
            this.langState.reset = 'Reset';
            this.langState.selectNone = 'Select None';
            this.langState.selectAll = 'Select All';
        }
        MultiSelect.prototype.setModel = function (inModel) {
            this.model = inModel;
        };
        MultiSelect.prototype.toJson = function () {
            console.log(this.out);
        };
        return MultiSelect;
    })();
    myApp.MultiSelect = MultiSelect;
    var EventType;
    (function (EventType) {
        EventType[EventType["call"] = 0] = "call";
        EventType[EventType["gpi"] = 1] = "gpi";
        EventType[EventType["key"] = 2] = "key";
        EventType[EventType["endpoint"] = 3] = "endpoint";
    })(EventType || (EventType = {}));
    ;
    var EventActionType;
    (function (EventActionType) {
        EventActionType[EventActionType["setutp_call"] = 0] = "setutp_call";
    })(EventActionType || (EventActionType = {}));
    ;
    var ToEvent = (function () {
        function ToEvent() {
        }
        ToEvent.getEventActionArrayFromType = function (type) {
            console.log('action ' + type);
            if (type == 0 /* setutp_call */) {
                var callDestination = new MultiSelect('Call Destination');
                callDestination.setModel([
                    { name: "100", data: "100", ticked: false },
                    { name: "101", data: "101", ticked: false },
                ]);
                return [callDestination];
            }
        };
        ToEvent.getEventTriggerArrayFromType = function (type) {
            if (type == 0 /* call */) {
                var callState = new MultiSelect('Call State');
                callState.setModel([
                    { name: "Trying", data: "trying", ticked: false },
                    { name: "Alerting", data: "alerting", ticked: false },
                    { name: "Queued/Busy", data: "queued", ticked: false },
                    { name: "Conversation", data: "in_call", ticked: false },
                    { name: "Hangup", data: "call_ended", ticked: false },
                ]);
                var callDirection = new MultiSelect('Call Direction');
                callDirection.setModel([
                    { name: "Incoming", data: "incoming", ticked: false },
                    { name: "Outgoing", data: "outgoing", ticked: false },
                ]);
                return [callState, callDirection];
            }
            else if (type == 3 /* endpoint */) {
                var endpointStateSelect = new MultiSelect('Endpoint State');
                endpointStateSelect.setModel([
                    { name: "Not Registered", data: "not_registered", ticked: false },
                    { name: "Idle", data: "idle", ticked: false },
                    { name: "In Call", data: "in_call", ticked: false },
                ]);
                return [endpointStateSelect];
            }
            else if (type == 1 /* gpi */) {
                var gpiId = new MultiSelect('GPI ID');
                gpiId.setModel([
                    { name: "GPI 1", data: "gpi1", ticked: false },
                    { name: "GPI 2", data: "gpi2", ticked: false },
                    { name: "GPI 3", data: "gpi3", ticked: false },
                ]);
                var gpiState = new MultiSelect('GPI State');
                gpiState.setModel([
                    { name: "On", data: "on", ticked: false },
                    { name: "Off", data: "off", ticked: false },
                ]);
                return [gpiId, gpiState];
            }
            else if (type == 2 /* key */) {
                var keyIdSelect = new MultiSelect('Key Id');
                keyIdSelect.setModel([
                    { name: "Programmable Key 1", data: "p1", ticked: false },
                    { name: "Programmable Key 2", data: "p2", ticked: false },
                ]);
                var keyStateSelect = new MultiSelect('Key State');
                keyStateSelect.setModel([
                    { name: "Press", data: "on", ticked: false },
                    { name: "Release", data: "off", ticked: false },
                ]);
                return [keyIdSelect, keyStateSelect];
            }
        };
        ToEvent.getEventRestrictionArrayFromType = function (type) {
            return this.getEventTriggerArrayFromType(type);
        };
        return ToEvent;
    })();
    myApp.ToEvent = ToEvent;
    var EventVM = (function () {
        function EventVM() {
            this.fullarray = [];
        }
        EventVM.prototype.toJson = function () {
            this.fullarray.forEach(function (multiselectRow) {
                console.log('Multiselect row start');
                multiselectRow.forEach(function (multiSelect) {
                    multiSelect.toJson();
                });
            });
        };
        EventVM.prototype.setEvent = function (type) {
            this.fullarray = [];
            this.addEvent(type);
        };
        EventVM.prototype.addEvent = function (type) {
            this.fullarray.push(type);
            this.toJson();
        };
        return EventVM;
    })();
    myApp.EventVM = EventVM;
    /**
     * event_rules { rule = [ name string, condition = {}, restriction = [], action = [] ] }
     */
    /**
     * The main controller for the app. The controller:
     * - retrieves and persists the model via the todoStorage service
     * - exposes the model to the template and provides event handlers
     */
    var EventCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function EventCtrl($scope) {
            this.$scope = $scope;
            this.triggerSelect = new MultiSelect('Choose Event Trigger');
            this.triggerSelect.setModel([
                { name: "Progammable Key Event (DAK)", data: 2 /* key */, ticked: false },
                { name: "Call Event", data: 0 /* call */, ticked: false },
                { name: "Main State Event", data: 3 /* endpoint */, ticked: false },
                { name: "Gpi Event", data: 1 /* gpi */, ticked: false },
            ]);
            this.filterSelect = new MultiSelect('Add Event Restriction');
            this.filterSelect.setModel([
                { name: "Add Call Restriction", data: 0 /* call */, ticked: false },
                { name: "Add Main State Restriction", data: 3 /* endpoint */, ticked: false },
                { name: "Add Gpi Restriction", data: 1 /* gpi */, ticked: false },
            ]);
            this.actionSelect = new MultiSelect('Choose Action');
            this.actionSelect.setModel([
                { name: "Setup call", data: 0 /* setutp_call */, ticked: false },
            ]);
            this.eventFilter = new EventVM();
            this.eventTrigger = new EventVM();
            this.eventAction = new EventVM();
            // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
            // for its methods to be accessible from view / HTML
            $scope.vm = this;
            // watching for events/changes in scope, which are caused by view/user input
            // if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
            //$scope.$watch('eventType', () => this.onChangedType(), true);
            //$scope.$watch('location.path()', path => this.onPath(path))
            //if ($location.path() === '') $location.path('/');
            //$scope.location = $location;
        }
        EventCtrl.prototype.onTriggerChanged = function (data) {
            this.eventTrigger.setEvent(ToEvent.getEventTriggerArrayFromType(data.data));
        };
        EventCtrl.prototype.onFilterChanged = function (data) {
            this.eventFilter.addEvent(ToEvent.getEventRestrictionArrayFromType(data.data));
        };
        EventCtrl.prototype.onActionChanged = function (data) {
            this.eventAction.addEvent(ToEvent.getEventActionArrayFromType(data.data));
        };
        EventCtrl.prototype.addUniqeArrayItem = function (array, item) {
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
        EventCtrl.$inject = [
            '$scope'
        ];
        return EventCtrl;
    })();
    myApp.EventCtrl = EventCtrl;
})(myApp || (myApp = {}));
//# sourceMappingURL=EventCtrl.js.map