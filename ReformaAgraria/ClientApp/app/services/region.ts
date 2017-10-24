import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RegionService {

    constructor(private http: Http) { }

    getRegion(regionId: string) {
        return this.http.get('/api/region/getRegion', regionId)
            .map(response => {
                let resp = response.json();
                return resp.data;
            })
    }

}