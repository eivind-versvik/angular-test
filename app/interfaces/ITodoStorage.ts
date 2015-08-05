/**
 * Created by eversvik on 22.06.2015.
 */
/// <reference path='../_all.ts' />

module myApp {
    export interface ITodoStorage {
        get ();
        put(todos);
    }
}