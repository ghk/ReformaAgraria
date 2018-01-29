import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { Region } from "../models/gen/region";

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

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }

}