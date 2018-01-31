import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs';

import { Region } from "../models/gen/region";

@Injectable()
export class SharedService {
    
    public region: Region;    
    private user: any;
    private region$: ReplaySubject<Region>;
    private toraSummary$: ReplaySubject<any[]>;

    constructor() {
        this.region$ = new ReplaySubject(1);
        this.toraSummary$ = new ReplaySubject(1);
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

    public getCurrentUser() {
        return this.user;
    }

    public setCurrentUser(user: any) {
        // WTF? Because jwt payload role can contain string or array
        if (user)
            user['role'] = [].concat(user['role']);
        this.user = user;
    }
}