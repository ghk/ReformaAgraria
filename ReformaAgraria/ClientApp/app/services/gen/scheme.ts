import { Injectable } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProgressHttp } from 'angular-progress-http';
import { CookieService } from 'ngx-cookie-service';

import { Query } from '../../models/query';
import { Scheme } from '../../models/gen/scheme';
import { EnvironmentService } from '../../services/environment';
import { CrudService } from '../../services/crud';
import { RequestHelper } from '../../helpers/request';

import * as urljoin from 'url-join';

@Injectable()
export class SchemeService implements CrudService<Scheme, number>{        

    private serverUrl: string;
   
    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private environmentService: EnvironmentService) { 
        this.serverUrl = this.environmentService.getEnvironment().serverUrl;
    }

    public getAll(query?: Query, progressListener?: any): Observable<Array<Scheme>> { 
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'scheme'),            
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
            urljoin(this.serverUrl, 'scheme', 'count'),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public getById(id: number, query?: Query, progressListener?: any): Observable<Scheme> {
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'scheme', id.toString()),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public createOrUpdate(model: Scheme, progressListener?: any): Observable<number> {
        if (!model['id']) {
            return this.create(model, progressListener);
        } else if (model['id']) {
            return this.update(model, progressListener);       
        }
    }

    public create(model: Scheme, progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'scheme'),            
            model,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public update(model: Scheme, progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'PUT',
            urljoin(this.serverUrl, 'scheme'),
            model,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public deleteById(id: any, progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'DELETE',
            urljoin(this.serverUrl, 'scheme', id.toString()),
            null,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    private handleError(error: Response) {
        return Observable.throw(error);
    }
}