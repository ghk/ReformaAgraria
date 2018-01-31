import { Injectable } from '@angular/core';

declare var ENV: string;
var ENVIRONMENT = require('../../environments/environment.ts')['environment'];
if ('Production' === ENV)
    ENVIRONMENT = require('../../environments/environment.prod.ts')['environment'];

@Injectable()
export class EnvironmentService {

    private _environment: any;

    constructor() {
        this._environment = ENVIRONMENT;
    }

    public getEnvironment() {
        return this._environment;
    }
}