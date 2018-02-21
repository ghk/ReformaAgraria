import { Injectable } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProgressHttp } from 'angular-progress-http';
import { CookieService } from 'ngx-cookie-service';

import { Query } from '../../models/query';
import { Region } from '../../models/gen/region';
import { EnvironmentService } from '../../services/environment';

import { RequestHelper } from '../../helpers/request';

import * as urljoin from 'url-join';

@Injectable()
export class RegionService {        

    private serverUrl: string;
   
    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private environmentService: EnvironmentService) { 
        this.serverUrl = this.environmentService.getEnvironment().serverUrl;
    }

    public getAll(query?: Query, progressListener?: any): Observable<Array<Region>> { 
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'region'),            
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public count(query?: Query, progressListener?: any): Observable<number> { 
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'region', 'count'),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public getById(id: string, query?: Query, progressListener?: any): Observable<Region> {
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'region', id.toString()),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    private handleError(error: Response) {
        return Observable.throw(error);
    }
}