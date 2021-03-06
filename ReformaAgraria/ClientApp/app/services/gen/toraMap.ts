﻿import { Injectable } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProgressHttp } from 'angular-progress-http';
import { CookieService } from 'ngx-cookie-service';

import { Query } from '../../models/query';
import { ToraMap } from '../../models/gen/toraMap';
import { UploadToraMapViewModel } from '../../models/gen/uploadToraMapViewModel';
import { EnvironmentService } from '../../services/environment';
import { CrudService } from '../../services/crud';
import { RequestHelper } from '../../helpers/request';

import * as urljoin from 'url-join';

@Injectable()
export class ToraMapService implements CrudService<ToraMap, number>{        

    private serverUrl: string;
   
    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private environmentService: EnvironmentService) { 
        this.serverUrl = this.environmentService.getEnvironment().serverUrl;
    }

    public getAll(query?: Query, progressListener?: any): Observable<Array<ToraMap>> { 
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'toramap'),            
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
            urljoin(this.serverUrl, 'toramap', 'count'),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public getById(id: number, query?: Query, progressListener?: any): Observable<ToraMap> {
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'toramap', id.toString()),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public createOrUpdate(model: ToraMap, progressListener?: any): Observable<number> {
        if (!model['id']) {
            return this.create(model, progressListener);
        } else if (model['id']) {
            return this.update(model, progressListener);       
        }
    }

    public create(model: ToraMap, progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'toramap'),            
            model,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public update(model: ToraMap, progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'PUT',
            urljoin(this.serverUrl, 'toramap'),
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
            urljoin(this.serverUrl, 'toramap', id.toString()),
            null,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public upload(model: FormData, progressListener?: any): Observable<ToraMap> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        options.headers.delete('Content-Type');                
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'toramap', 'upload'),
            model,
            null,
            progressListener,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public download(id: number, query?: Query, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        options.responseType = ResponseContentType.Blob;                
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'toramap', 'download', id.toString()),
            null,
            progressListener,
            null,
        );

        return request.catch(this.handleError)
    }
    
    public downloadByToraObject(toraObjectId: number, query?: Query, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        options.responseType = ResponseContentType.Blob;                
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'toramap', 'download', 'toraobject', toraObjectId.toString()),
            null,
            progressListener,
            null,
        );

        return request.catch(this.handleError)
    }
    
    public downloadByRegion(regionId: string, query?: Query, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        options.responseType = ResponseContentType.Blob;                
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'toramap', 'download', 'region', encodeURIComponent(regionId)),
            null,
            progressListener,
            null,
        );

        return request.catch(this.handleError)
    }
    
    public calculate(query?: Query, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'toramap', 'calculate', 'all'),
            null,
            progressListener,
            null,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public calculateById(id: number, query?: Query, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'toramap', 'calculate', id.toString()),
            null,
            progressListener,
            null,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    private handleError(error: Response) {
        return Observable.throw(error);
    }
}