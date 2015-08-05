/**
 * Created by eversvik on 22.06.2015.
 */
/// <reference path='../_all.ts' />

module myApp {
    'use strict';
    export class TodoStorage {
        static STORAGE_ID = 'todos-angularjs';

        // dependencies would be injected here
        constructor() {
            console.log('todostorage');
        }

        get() {
            //return [];
            return JSON.parse(localStorage.getItem(TodoStorage.STORAGE_ID) || '[]');
        }

        put(todos) {
            localStorage.setItem(TodoStorage.STORAGE_ID, JSON.stringify(todos));
        }
    }

}