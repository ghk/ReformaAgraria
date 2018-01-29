import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs';

import { Region } from "../models/gen/region";
import { RegionService } from './gen/region';

@Injectable()
export class SharedService {

    public region: Region;
    private _region$: ReplaySubject<Region>;
    private _toraSummary$: ReplaySubject<any[]>;

    constructor(
        private regionService: RegionService
    ) {
        this._region$ = new ReplaySubject(1);
        this._toraSummary$ = new ReplaySubject(1);
    }

    public getRegion() {      
        return this._region$;
    }

    public setRegion(region: Region) {
        this.region = region;
        this._region$.next(region);
    }

    public getToraSummary() {
        return this._toraSummary$;
    }

    public setToraSummary(tora: any[]) {
        this._toraSummary$.next(tora);
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