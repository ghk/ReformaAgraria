import { Injectable } from '@angular/core';
import { Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProgressHttp } from 'angular-progress-http';
import { CookieService } from 'ngx-cookie-service';

import { RequestHelper } from '../helpers/request';

import { Query } from '../../models/query';
import { Region } from '../../models/gen/region';
import { SharedService } from '../../services/shared';

import * as urljoin from 'url-join';

@Injectable()
export class RegionService {        

    private serverUrl: string;
   
    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private sharedService: SharedService) { 
        this.serverUrl = this.sharedService.getEnvironment().serverUrl;
    } 

    public GetAll(query: Query, progressListener: any): Observable<Array<Region>> { 
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'GET',
            urljoin(this.serverUrl, 'region'),
            query,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public Count(query: Query, progressListener: any): Observable<number> { 
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'GET',
            urljoin(this.serverUrl, 'region', 'count'),
            query,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public Get(id: any, progressListener: any): Observable<Region> {
            let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'GET',
            urljoin(this.serverUrl, 'region', id),
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public getRegion (regionType: string, parent: string) {
            let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
            let params = new URLSearchParams();
            params.append('regionType', regionType);
            params.append('parent', parent);
            requestOptions.params = params;
            return this.http.post('/api/region/getregion', params)
                .map(res => res.json());
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