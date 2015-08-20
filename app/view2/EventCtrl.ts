/**
 * Created by eversvik on 28.07.2015.
 */

/// <reference path='../_all.ts' />

module myApp {
    'use strict';

    export interface IEventScope extends ng.IScope {
        vm: EventCtrl;
    }

    export class MultiSelect {
        // class for converting between isteven-multiselect to our format

        private langState: any;
        private model: any;
        private out: any;

        constructor(defaultText: string)
        {
            this.langState = {};
            this.langState.nothingSelected = defaultText;
            this.langState.search = 'Search';
            this.langState.reset = 'Reset';
            this.langState.selectNone = 'Select None';
            this.langState.selectAll = 'Select All';
        }

        public setModel(inModel: any)
        {
            this.model = inModel;
        }

        public toJson()
        {
            console.log(this.out);
        }
    }

    enum EventType {call, gpi, key, endpoint};
    enum EventActionType {setutp_call};

    export class ToEvent {
        public static getEventActionArrayFromType(type:EventActionType) {
            console.log('action ' + type);
            if (type == EventActionType.setutp_call) {
                var callDestination = new MultiSelect('Call Destination');
                callDestination.setModel([
                    {name: "100", data: "100", ticked: false},
                    {name: "101", data: "101", ticked: false},
                ]);

                return [callDestination];
            }
        }

        public static getEventTriggerArrayFromType(type: EventType)
        {
            if(type == EventType.call)
            {
                var callState = new MultiSelect('Call State');
                callState.setModel([
                    {	name: "Trying", data:"trying", ticked: false	},
                    {	name: "Alerting", data:"alerting", ticked: false	},
                    {	name: "Queued/Busy", data:"queued",	ticked: false	},
                    {	name: "Conversation", data:"in_call",	ticked: false	},
                    {	name: "Hangup", data:"call_ended",	ticked: false	},
                ]);

                var callDirection = new MultiSelect('Call Direction');
                callDirection.setModel([
                    {	name: "Incoming", data:"incoming",	ticked: false	},
                    {	name: "Outgoing",    data:"outgoing", ticked: false	},
                ]);

                return [ callState, callDirection ];
            }
            else if(type == EventType.endpoint)
            {
                var endpointStateSelect = new MultiSelect('Endpoint State');
                endpointStateSelect.setModel([
                    {	name: "Not Registered", data:"not_registered",	ticked: false	},
                    {	name: "Idle",    data:"idle", ticked: false	},
                    {	name: "In Call",    data: "in_call",	ticked: false	},
                ]);

                return [ endpointStateSelect ];
            }
            else if(type == EventType.gpi)
            {
                var gpiId = new MultiSelect('GPI ID');
                gpiId.setModel([
                    {	name: "GPI 1", data:"gpi1",	ticked: false	},
                    {	name: "GPI 2",    data:"gpi2", ticked: false	},
                    {	name: "GPI 3",    data:"gpi3", ticked: false	},
                ]);

                var gpiState = new MultiSelect('GPI State');
                gpiState.setModel([
                    {	name: "On", data:"on",	ticked: false	},
                    {	name: "Off",    data:"off", ticked: false	},
                ]);

               return [ gpiId, gpiState ];
            }
            else if(type == EventType.key)
            {
                var keyIdSelect = new MultiSelect('Key Id');
                keyIdSelect.setModel([
                    {	name: "Programmable Key 1", data:"p1",	ticked: false	},
                    {	name: "Programmable Key 2", data:"p2", ticked: false	},
                ]);

                var keyStateSelect= new MultiSelect('Key State');
                keyStateSelect.setModel([
                    {	name: "Press", data:"on",	ticked: false	},
                    {	name: "Release",    data:"off", ticked: false	},
                ]);

                return [ keyIdSelect, keyStateSelect ];
            }

        }


        public static getEventRestrictionArrayFromType(type: EventType)
        {
            return this.getEventTriggerArrayFromType(type);
        }

    }

    export class EventVM {
        private fullarray: any;

        constructor() {
            this.fullarray = [];
        }

        public toJson()
        {
            this.fullarray.forEach(function(multiselectRow) {
                console.log('Multiselect row start');
                multiselectRow.forEach(function(multiSelect) {
                    multiSelect.toJson();
                });
            });
        }

        public setEvent(type: any)
        {
            this.fullarray = [];
            this.addEvent(type);
        }

        public addEvent(type: any)
        {
            this.fullarray.push(type);
            this.toJson();
        }
    }


    /**
     * event_rules { rule = [ name string, condition = {}, restriction = [], action = [] ] }
     */

    /**
     * The main controller for the app. The controller:
     * - retrieves and persists the model via the todoStorage service
     * - exposes the model to the template and provides event handlers
     */
    export class EventCtrl {

        private triggerSelect: MultiSelect;
        private filterSelect: MultiSelect;
        private actionSelect: MultiSelect;

        private eventFilter: EventVM;
        private eventTrigger: EventVM;
        private eventAction: EventVM;

        // $inject annotation.
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        public static $inject = [
            '$scope'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope: IEventScope
        ) {
            this.triggerSelect = new MultiSelect('Choose Event Trigger');
            this.triggerSelect.setModel([
                {	name: "Progammable Key Event (DAK)", data:EventType.key,	ticked: false	},
                {	name: "Call Event", data:EventType.call,	ticked: false	},
                {	name: "Main State Event",    data:EventType.endpoint, ticked: false	},
                {	name: "Gpi Event",    data:EventType.gpi, ticked: false	},
            ]);

            this.filterSelect = new MultiSelect('Add Event Restriction');
            this.filterSelect.setModel([
                {	name: "Add Call Restriction", data:EventType.call,	ticked: false	},
                {	name: "Add Main State Restriction",    data:EventType.endpoint, ticked: false	},
                {	name: "Add Gpi Restriction",    data:EventType.gpi, ticked: false	},
            ]);

            this.actionSelect = new MultiSelect('Choose Action');
            this.actionSelect.setModel([
                {	name: "Setup call", data:EventActionType.setutp_call,	ticked: false	},
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

        private onTriggerChanged(data: any)
        {
            this.eventTrigger.setEvent(ToEvent.getEventTriggerArrayFromType(data.data));
        }

        private onFilterChanged(data: any)
        {
            this.eventFilter.addEvent(ToEvent.getEventRestrictionArrayFromType(data.data));
        }

        private onActionChanged(data: any)
        {
            this.eventAction.addEvent(ToEvent.getEventActionArrayFromType(data.data));
        }

        private addUniqeArrayItem(array: string[], item: string)
        {
            if(item == null || item == "")
                return;
            for(var i = 0, l = array.length; i < l; i++)
            {
                if(array[i] == item)
                    return;
            }
            //console.log(item);
            array.push(item);
            console.log(array);
        }
    }

}

