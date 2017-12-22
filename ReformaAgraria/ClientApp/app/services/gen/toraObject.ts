import { Injectable } from '@angular/core';
import { Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProgressHttp } from 'angular-progress-http';
import { CookieService } from 'ngx-cookie-service';

import { Query } from '../../models/query';
import { ToraObject } from '../../models/gen/toraobject';
import { RequestHelper } from '../../helpers/request';
import { SharedService } from '../../services/shared';
import { CrudService } from '../../services/crud';

import * as urljoin from 'url-join';

@Injectable()
export class ToraObjectService implements CrudService<ToraObject, number>{        

    private serverUrl: string;
   
    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private sharedService: SharedService) { 
        this.serverUrl = this.sharedService.getEnvironment().serverUrl;
    } 

    public getAll(query?: Query, progressListener?: any): Observable<Array<ToraObject>> { 
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'GET',
            urljoin(this.serverUrl, 'toraobject'),
            query,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public count(query?: Query, progressListener?: any): Observable<number> { 
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'GET',
            urljoin(this.serverUrl, 'toraobject', 'count'),
            query,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public getById(id: number, query?: Query, progressListener?: any): Observable<ToraObject> {
            let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'GET',
            urljoin(this.serverUrl, 'toraobject', id),
            query,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public createOrUpdate(model: ToraObject, progressListener?: any): Observable<number> {
        let method = 'POST';
        if (!model['id']) {
            return this.create(model, progressListener);
        } else if (model['id']) {
            return this.update(model, progressListener);       
        }
    }

    public create(model: ToraObject, progressListener?: any): Observable<number> {
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'POST',
            urljoin(this.serverUrl, 'toraobject'),
            null,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public update(model: ToraObject, progressListener?: any): Observable<number> {
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'PUT',
            urljoin(this.serverUrl, 'toraobject'),
            null,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public deleteById(id: any, progressListener?: any): Observable<number> {
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'DELETE',
            urljoin(this.serverUrl, 'toraobject', id),
            null,
            null,
            progressListener
        );

        return request.map(res => res).catch(this.handleError);
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