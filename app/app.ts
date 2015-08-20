/**
 * Created by eversvik on 21.06.2015.
 */
/// <reference path='_all.ts' />

module Base
{
    export class Module
    {
        public app: ng.IModule;

        constructor( name: string, modules: Array< string > )
        {
            this.app = angular.module( name, modules );
        }

        addController( name: string, controller: Function )
        {
            this.app.controller( name, controller );
        }
        addService( name: string, service: Function ): void
        {
            this.app.service( name, service );
        }
        addConfig(config): void
        {
            this.app.config(config);
        }

        addDirective(direc): void {
            this.app.directive(direc);
        }
    }
}

module myApp
{
    'use strict';
    var myApp = new Base.Module('myApp', ['ngRoute', 'myApp.version', 'isteven-multi-select']);

    myApp.addService('todoStorage', TodoStorage);
    // myApp.addDirective('isteven-multi-select');
    myApp.addConfig(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: EventCtrl
        });
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: TodoCtrl
        });

    }]);


}


