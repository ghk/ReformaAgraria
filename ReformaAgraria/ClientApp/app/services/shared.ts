﻿import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Subject} from 'rxjs/Subject';
import { Region } from "../models/gen/region";

declare var ENV: string;
var ENVIRONMENT = require('../../environments/environment.ts')['environment'];
if ('Production' === ENV)
    ENVIRONMENT = require('../../environments/environment.prod.ts')['environment'];

@Injectable()
export class SharedService {

    private _environment: any;
    private _region$: ReplaySubject<Region>;
    private _regionId$: ReplaySubject<string>;

    constructor() {
        this._environment = ENVIRONMENT;
        this._region$ = new ReplaySubject(1);
        this._regionId$ = new ReplaySubject(1);
    }

    public getEnvironment() {        
        return this._environment;
    }

    public getRegion() {
        return this._region$;
    }

    public setRegion(region: Region) {
        this._region$.next(region);
    }

    public getRegionId() {
        return this._regionId$;
    }

    public setRegionId(id: string) {
        this._regionId$.next(id);
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