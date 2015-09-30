/**
 * Created by eversvik on 28.07.2015.
 */
/// <reference path='../_all.ts' />
var myApp;
(function (myApp) {
    'use strict';
    var MultiSelect = (function () {
        function MultiSelect(defaultText, id) {
            this.langState = {};
            this.label = defaultText;
            this.langState.nothingSelected = defaultText;
            this.langState.search = 'Search';
            this.langState.reset = 'Reset';
            this.langState.selectNone = 'Select None';
            this.langState.selectAll = 'Select All';
            this.out = [];
            this.id = id;
        }
        MultiSelect.prototype.setModel = function (inModel) {
            this.model = inModel;
        };
        MultiSelect.prototype.toJson = function () {
            var jsonv = {};
            jsonv[this.id] = this.out;
            return jsonv;
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
        EventActionType[EventActionType["setup_call"] = 0] = "setup_call";
    })(EventActionType || (EventActionType = {}));
    ;
    var ToEvent = (function () {
        function ToEvent() {
        }
        ToEvent.getEventActionArrayFromType = function (type) {
            console.log('action ' + type);
            if (type == 0 /* setup_call */) {
                var callDestination = new MultiSelect('Call Destination', 'to');
                callDestination.setModel([
                    { name: "100", data: "100", ticked: false },
                    { name: "101", data: "101", ticked: false },
                ]);
                return { array: [callDestination], id: 'call_setup' };
            }
        };
        ToEvent.getEventTriggerArrayFromType = function (type) {
            if (type == 0 /* call */) {
                var callState = new MultiSelect('Call State', 'state');
                callState.setModel([
                    { name: "Trying", data: "trying", ticked: false },
                    { name: "Alerting", data: "alerting", ticked: false },
                    { name: "Queued/Busy", data: "queued", ticked: false },
                    { name: "Conversation", data: "in_call", ticked: false },
                    { name: "Hangup", data: "call_ended", ticked: false },
                ]);
                var callDirection = new MultiSelect('Call Direction', 'direction');
                callDirection.setModel([
                    { name: "Incoming", data: "incoming", ticked: false },
                    { name: "Outgoing", data: "outgoing", ticked: false },
                ]);
                return { array: [callState, callDirection], id: 'call' };
            }
            else if (type == 3 /* endpoint */) {
                var endpointStateSelect = new MultiSelect('Endpoint State', 'state');
                endpointStateSelect.setModel([
                    { name: "Not Registered", data: "not_registered", ticked: false },
                    { name: "Idle", data: "idle", ticked: false },
                    { name: "Call", data: "call", ticked: false },
                ]);
                return { array: [endpointStateSelect], id: 'endpoint' };
            }
            else if (type == 1 /* gpi */) {
                var gpiId = new MultiSelect('GPI ID', 'kid');
                gpiId.setModel([
                    { name: "GPI 1", data: "gpi1", ticked: false },
                    { name: "GPI 2", data: "gpi2", ticked: false },
                    { name: "GPI 3", data: "gpi3", ticked: false },
                ]);
                var gpiState = new MultiSelect('GPI State', 'state');
                gpiState.setModel([
                    { name: "On", data: "on", ticked: false },
                    { name: "Off", data: "off", ticked: false },
                ]);
                return { array: [gpiId, gpiState], id: 'gpi' };
            }
            else if (type == 2 /* key */) {
                var keyIdSelect = new MultiSelect('Key Id', 'kid');
                keyIdSelect.setModel([
                    { name: "DAK 1", data: "p1", ticked: false },
                    { name: "DAK 2", data: "p2", ticked: false },
                ]);
                var keyStateSelect = new MultiSelect('Key State', 'state');
                keyStateSelect.setModel([
                    { name: "Press", data: "on", ticked: false },
                    { name: "Release", data: "off", ticked: false },
                ]);
                return { array: [keyIdSelect, keyStateSelect], id: 'key' };
            }
        };
        ToEvent.getEventRestrictionArrayFromType = function (type) {
            return this.getEventTriggerArrayFromType(type);
        };
        return ToEvent;
    })();
    myApp.ToEvent = ToEvent;
    var EventVM = (function () {
        function EventVM(id) {
            this.fullarray = [];
            this.id = id;
        }
        EventVM.prototype.toJson = function () {
            if (!this.id)
                return;
            console.log(this.id);
            var id = this.id;
            var tmpv = {};
            tmpv[id] = [];
            //console.log(this.fullarray);
            this.fullarray.forEach(function (multiselectRow) {
                var arrayid = {};
                arrayid[multiselectRow.id] = [];
                multiselectRow.array.forEach(function (multiSelect) {
                    var res = multiSelect.toJson();
                    if (res) {
                        arrayid[multiselectRow.id].push(multiSelect.toJson());
                    }
                });
                tmpv[id].push(arrayid);
            });
            return tmpv;
        };
        EventVM.prototype.setEvent = function (type) {
            //console.log(JSON.stringify(type));
            this.fullarray = [];
            this.addEvent(type);
        };
        EventVM.prototype.addEvent = function (type) {
            this.fullarray.push(type);
            //console.log(type);
            //console.log(this.fullarray);
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
            this.selected_items = [];
            this.triggerSelect = new MultiSelect('Choose Event Trigger', 'trigger');
            this.triggerSelect.setModel([
                { name: "Progammable Key Event (DAK)", data: 2 /* key */, ticked: false },
                { name: "Call Event", data: 0 /* call */, ticked: false },
                { name: "Main State Event", data: 3 /* endpoint */, ticked: false },
                { name: "Gpi Event", data: 1 /* gpi */, ticked: false },
            ]);
            this.filterSelect = new MultiSelect('Add Event Restriction', 'restriction');
            this.filterSelect.setModel([
                { name: "Add Call Restriction", data: 0 /* call */, ticked: false },
                { name: "Add Main State Restriction", data: 3 /* endpoint */, ticked: false },
                { name: "Add Gpi Restriction", data: 1 /* gpi */, ticked: false },
            ]);
            this.actionSelect = new MultiSelect('Choose Action', 'action');
            this.actionSelect.setModel([
                { name: "Setup call", data: 0 /* setup_call */, ticked: false },
            ]);
            this.eventFilter = new EventVM('restriction');
            this.eventTrigger = new EventVM('condition');
            this.eventAction = new EventVM('action');
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
            console.log(data);
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
        EventCtrl.prototype.save = function () {
            console.log('save');
            var tmp = {};
            tmp['1'] = this.eventTrigger.toJson();
            tmp['2'] = this.eventFilter.toJson();
            tmp['3'] = this.eventAction.toJson();
            console.log(JSON.stringify(tmp));
            this.eventdata = this.eventFilter.toJson();
            this.triggerdata = this.eventTrigger.toJson();
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