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
        private label: string;
        private id: string;

        constructor(defaultText: string, id: string)
        {
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

        public setModel(inModel: any)
        {
            this.model = inModel;
        }

        public toJson()
        {
            var jsonv = {};
            jsonv[this.id] = this.out;
            return jsonv;
        }
    }

    enum EventType {call, gpi, key, endpoint};
    enum EventActionType {setup_call};

    export class ToEvent {
        public static getEventActionArrayFromType(type:EventActionType) {
            console.log('action ' + type);
            if (type == EventActionType.setup_call) {
                var callDestination = new MultiSelect('Call Destination', 'to');
                callDestination.setModel([
                    {name: "100", data: "100", ticked: false},
                    {name: "101", data: "101", ticked: false},
                ]);

                return { array: [callDestination], id: 'call_setup' };
            }
        }

        public static getEventTriggerArrayFromType(type: EventType)
        {
            if(type == EventType.call)
            {
                var callState = new MultiSelect('Call State', 'state');
                callState.setModel([
                    {	name: "Trying", data:"trying", ticked: false	},
                    {	name: "Alerting", data:"alerting", ticked: false	},
                    {	name: "Queued/Busy", data:"queued",	ticked: false	},
                    {	name: "Conversation", data:"in_call",	ticked: false	},
                    {	name: "Hangup", data:"call_ended",	ticked: false	},
                ]);

                var callDirection = new MultiSelect('Call Direction', 'direction');
                callDirection.setModel([
                    {	name: "Incoming", data:"incoming",	ticked: false	},
                    {	name: "Outgoing",    data:"outgoing", ticked: false	},
                ]);

                return { array: [ callState, callDirection ], id: 'call'};
            }
            else if(type == EventType.endpoint)
            {
                var endpointStateSelect = new MultiSelect('Endpoint State', 'state');
                endpointStateSelect.setModel([
                    {	name: "Not Registered", data:"not_registered",	ticked: false	},
                    {	name: "Idle",    data:"idle", ticked: false	},
                    {	name: "Call",    data: "call",	ticked: false	},
                ]);

                return { array: [ endpointStateSelect ], id: 'endpoint' };
            }
            else if(type == EventType.gpi)
            {
                var gpiId = new MultiSelect('GPI ID', 'kid');
                gpiId.setModel([
                    {	name: "GPI 1", data:"gpi1",	ticked: false	},
                    {	name: "GPI 2",    data:"gpi2", ticked: false	},
                    {	name: "GPI 3",    data:"gpi3", ticked: false	},
                ]);

                var gpiState = new MultiSelect('GPI State', 'state');
                gpiState.setModel([
                    {	name: "On", data:"on",	ticked: false	},
                    {	name: "Off",    data:"off", ticked: false	},
                ]);

               return { array: [ gpiId, gpiState ], id: 'gpi'};
            }
            else if(type == EventType.key)
            {
                var keyIdSelect = new MultiSelect('Key Id', 'kid');
                keyIdSelect.setModel([
                    {	name: "DAK 1", data:"p1",	ticked: false	},
                    {	name: "DAK 2", data:"p2", ticked: false	},
                ]);

                var keyStateSelect= new MultiSelect('Key State', 'state');
                keyStateSelect.setModel([
                    {	name: "Press", data:"on",	ticked: false	},
                    {	name: "Release",    data:"off", ticked: false	},
                ]);

                return { array: [ keyIdSelect, keyStateSelect ], id: 'key' };
            }

        }


        public static getEventRestrictionArrayFromType(type: EventType)
        {
            return this.getEventTriggerArrayFromType(type);
        }

    }

    export class EventVM {
        private fullarray: any;
        private id: string;

        constructor(id: string) {
            this.fullarray = [];
            this.id = id;
        }

        public toJson()
        {
            if(!this.id)
                return;
            console.log(this.id);
            var id = this.id;
            var tmpv = {};
            tmpv[id] = [];

            //console.log(this.fullarray);
            this.fullarray.forEach(function(multiselectRow) {
                var arrayid = {};
                arrayid[multiselectRow.id] = [];
                multiselectRow.array.forEach(function(multiSelect) {
                    var res = multiSelect.toJson();
                    if(res) {
                        arrayid[multiselectRow.id].push(multiSelect.toJson());
                    }

                });
                tmpv[id].push(arrayid);

            });

            return tmpv;
        }

        public setEvent(type: any)
        {
            //console.log(JSON.stringify(type));
            this.fullarray = [];
            this.addEvent(type);
        }

        public addEvent(type: any)
        {
            this.fullarray.push(type);
            //console.log(type);
            //console.log(this.fullarray);

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

        private triggerdata: any;
        private eventdata: any;


        private selected_items: any;

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
            this.selected_items = [];
            this.triggerSelect = new MultiSelect('Choose Event Trigger', 'trigger');
            this.triggerSelect.setModel([
                {	name: "Progammable Key Event (DAK)", data:EventType.key,	ticked: false	},
                {	name: "Call Event", data:EventType.call,	ticked: false	},
                {	name: "Main State Event",    data:EventType.endpoint, ticked: false	},
                {	name: "Gpi Event",    data:EventType.gpi, ticked: false	},
            ]);

            this.filterSelect = new MultiSelect('Add Event Restriction', 'restriction');
            this.filterSelect.setModel([
                {	name: "Add Call Restriction", data:EventType.call,	ticked: false	},
                {	name: "Add Main State Restriction",    data:EventType.endpoint, ticked: false	},
                {	name: "Add Gpi Restriction",    data:EventType.gpi, ticked: false	},
            ]);

            this.actionSelect = new MultiSelect('Choose Action', 'action');
            this.actionSelect.setModel([
                {	name: "Setup call", data:EventActionType.setup_call,	ticked: false	},
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

        private onTriggerChanged(data: any)
        {
            console.log(data);
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

        private save()
        {
            console.log('save');
            var tmp : any = {};
            tmp['1'] = this.eventTrigger.toJson();
            tmp['2'] = this.eventFilter.toJson();
            tmp['3'] = this.eventAction.toJson();
            console.log(JSON.stringify(tmp));

            this.eventdata = this.eventFilter.toJson();
            this.triggerdata = this.eventTrigger.toJson();

        }
    }

}

