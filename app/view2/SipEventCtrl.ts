/**
 * Created by eversvik on 28.07.2015.
 */

/// <reference path='../_all.ts' />

module myApp {
    'use strict';

    export interface ISipEventScope extends ng.IScope {
        vm: SipEventCtrl;
        newevent: SipEventCfg;
    }

    export class SipEventKey {
        private kid: string;
        private state: string;
    }

    export class SipEventEndpoint {
        private state:string[] =[];
    }

    export class SipEventCondition {
        private key: SipEventKey;
        private endpoint: SipEventEndpoint;

        constructor() {
            this.endpoint = new SipEventEndpoint();
            this.key = new SipEventKey();
        }

        clear(type: string){
            console.log('clearing ' + type)
            if(type != 'key')
                delete this.key;
            if(type != 'endpoint')
                delete this.endpoint;
        }
    }

    export class SipEventCfg {
        private condition: SipEventCondition;
        private restriction: SipEventCondition[];

        constructor(
        )
        {
            this.condition = new SipEventCondition();
        }

        dosomething() {

            console.log('Adding SipEventCfg')
            console.log(JSON.stringify(this));
        }

        clear(type: string){
            this.condition.clear(type);
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
    export class SipEventCtrl {

        private newevent: SipEventCfg;
        private eventType: string;
        private modernBrowsers: any;

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
            private $scope: ISipEventScope
        ) {
            console.log('SipEventCtrl Constructor');

            this.newevent = new SipEventCfg();
            this.eventType = 'endpoint';

            // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
            // for its methods to be accessible from view / HTML
            $scope.vm = this;

            this.modernBrowsers = [
                {	name: "Not Registered", data:"not_registered",	ticked: false	},
                {	name: "Idle",    data:"idle", ticked: false	},
                {	name: "In Call",    data: "in_call",	ticked: false	},
            ];
            // watching for events/changes in scope, which are caused by view/user input
            // if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
            //$scope.$watch('eventType', () => this.onChangedType(), true);
            //$scope.$watch('location.path()', path => this.onPath(path))

            //if ($location.path() === '') $location.path('/');
            //$scope.location = $location;
        }

        private addNewEvent()
        {
            this.newevent.clear(this.eventType);
            this.newevent.dosomething();
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

