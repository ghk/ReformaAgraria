import { Injectable } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProgressHttp } from 'angular-progress-http';
import { CookieService } from 'ngx-cookie-service';

import { Query } from '../../models/query';
import { SearchViewModel } from '../../models/gen/searchViewModel';
import { EnvironmentService } from '../../services/environment';

import { RequestHelper } from '../../helpers/request';

import * as urljoin from 'url-join';

@Injectable()
export class SearchService {        

    private serverUrl: string;
   
    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private environmentService: EnvironmentService) { 
        this.serverUrl = this.environmentService.getEnvironment().serverUrl;
    }
    
    public search(keywords: string, query?: Query, progressListener?: any): Observable<SearchViewModel[]> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'search', encodeURIComponent(keywords)),
            null,
            progressListener,
            null,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public searchRegion(keywords: string, query?: Query, progressListener?: any): Observable<SearchViewModel[]> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'search', 'region', encodeURIComponent(keywords)),
            null,
            progressListener,
            null,
        );

        return request.map(res => res.json()).catch(this.handleError);
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