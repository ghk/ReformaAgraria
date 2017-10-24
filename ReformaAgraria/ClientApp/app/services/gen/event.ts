import { Injectable } from '@angular/core';
import { Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProgressHttp } from 'angular-progress-http';
import { CookieService } from 'ngx-cookie-service';

import { Query } from '../../models/query';
import { Event } from '../../models/gen/event';
import { RequestHelper } from '../../helpers/request';
import { SharedService } from '../../services/shared';

import * as urljoin from 'url-join';

@Injectable()
export class EventService {        

    private serverUrl: string;
   
    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private sharedService: SharedService) { 
        this.serverUrl = this.sharedService.getEnvironment().serverUrl;
    } 

    public GetAll(query: Query, progressListener: any): Observable<Array<Event>> { 
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'GET',
            urljoin(this.serverUrl, 'event'),
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
            urljoin(this.serverUrl, 'event', 'count'),
            query,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public Get(id: any, progressListener: any): Observable<Event> {
            let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'GET',
            urljoin(this.serverUrl, 'event', id),
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public Post(model: Event, progressListener: any): Observable<number> {
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'POST',
            urljoin(this.serverUrl, 'event'),
            null,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public Put(model: Event, progressListener: any): Observable<number> {
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'PUT',
            urljoin(this.serverUrl, 'event'),
            null,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public Delete(id: any, progressListener: any): Observable<number> {
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'DELETE',
            urljoin(this.serverUrl, 'event', id),
            null,
            null,
            progressListener
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