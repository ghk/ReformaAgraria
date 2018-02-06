import { Injectable } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProgressHttp } from 'angular-progress-http';
import { CookieService } from 'ngx-cookie-service';

import { Query } from '../../models/query';
import { Event } from '../../models/gen/event';
import { EnvironmentService } from '../../services/environment';
import { CrudService } from '../../services/crud';
import { RequestHelper } from '../../helpers/request';

import * as urljoin from 'url-join';

@Injectable()
export class EventService implements CrudService<Event, number>{        

    private serverUrl: string;
   
    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private environmentService: EnvironmentService) { 
        this.serverUrl = this.environmentService.getEnvironment().serverUrl;
    }

    public getAll(query?: Query, progressListener?: any): Observable<Array<Event>> { 
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'event'),            
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
            urljoin(this.serverUrl, 'event', 'count'),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public getById(id: number, query?: Query, progressListener?: any): Observable<Event> {
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'event', id),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public createOrUpdate(model: Event, progressListener?: any): Observable<number> {
        if (!model['id']) {
            return this.create(model, progressListener);
        } else if (model['id']) {
            return this.update(model, progressListener);       
        }
    }

    public create(model: Event, progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'event'),            
            model,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public update(model: Event, progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'PUT',
            urljoin(this.serverUrl, 'event'),
            model,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public getDocumentsName(id: string, type: string, query?: Query, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'event', 'getdocumentsname?id=' + id + '&type=' + type),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public deleteAttachment(id: string, attachment: string, query?: Query, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'event', 'deleteattachment?id=' + id + '&attachment=' + attachment),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public deleteById(id: any, progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'DELETE',
            urljoin(this.serverUrl, 'event', id),
            null,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public upload(model: FormData, progressListener?: any): Observable<Event> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        options.headers.delete('Content-Type');
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'event', 'upload'),
            model,
            null,
            progressListener,
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