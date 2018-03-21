import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { Region } from "../models/gen/region";

import * as jwt from 'jsonwebtoken';

@Injectable()
export class SharedService {
    
    public region: Region;    
    private user: any;
    private region$: ReplaySubject<Region>;
    private toraSummary$: ReplaySubject<any[]>;
    private persilSummary$: ReplaySubject<any>;
    private reloadToraMap$: Subject<boolean>;
    private reloadVillageBorderMap$: Subject<boolean>;
    private summaryStatus$: ReplaySubject<any>;

    constructor(
        private cookieService: CookieService
    ) {
        this.region$ = new ReplaySubject(1);
        this.toraSummary$ = new ReplaySubject(1);
        this.persilSummary$ = new ReplaySubject(1);
        this.summaryStatus$ = new ReplaySubject(1);
        this.reloadToraMap$ = new Subject<boolean>();
        this.reloadVillageBorderMap$ = new Subject<boolean>();
    }

    public getRegion() {
        return this.region$;
    }

    public setRegion(region: Region) {
        this.region = region;
        this.region$.next(region);
    }

    public getToraSummary() {
        return this.toraSummary$;
    }
    
    public setToraSummary(tora: any[]) {
        this.toraSummary$.next(tora);
    }

    public setSummaryStatus(status: string) {
        this.summaryStatus$.next(status);
    }

    public getSummaryStatus() {
        return this.summaryStatus$;
    }

    public getReloadToraMap() {
        return this.reloadToraMap$;
    }

    public setReloadToraMap(status: boolean) {
        this.reloadToraMap$.next(status);
    }

    public getReloadVillageBorderMap() {
        return this.reloadVillageBorderMap$;
    }

    public setReloadVillageBorderMap(status: boolean) {
        this.reloadVillageBorderMap$.next(status);
    }

    public getCurrentUser() {
        if (!this.user) {
            let accessToken = this.cookieService.get('accessToken');
            if (!accessToken)
                return null;
            
            let payload = jwt.decode(accessToken);
            if (!payload)
                return null;
            
            payload.role = [].concat(payload.role);
            this.user = payload;
        }
        
        return this.user;
    }
}