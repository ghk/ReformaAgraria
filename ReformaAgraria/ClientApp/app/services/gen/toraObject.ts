import { Injectable } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProgressHttp } from 'angular-progress-http';
import { CookieService } from 'ngx-cookie-service';

import { Query } from '../../models/query';
import { ToraObject } from '../../models/gen/toraObject';
import { UploadToraDocumentViewModel } from '../../models/gen/uploadToraDocumentViewModel';
import { DashboardDataViewModel } from '../../models/gen/dashboardDataViewModel';
import { EnvironmentService } from '../../services/environment';
import { CrudService } from '../../services/crud';
import { RequestHelper } from '../../helpers/request';

import * as urljoin from 'url-join';

@Injectable()
export class ToraObjectService implements CrudService<ToraObject, number>{        

    private serverUrl: string;
   
    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private environmentService: EnvironmentService) { 
        this.serverUrl = this.environmentService.getEnvironment().serverUrl;
    }

    public getAll(query?: Query, progressListener?: any): Observable<Array<ToraObject>> { 
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'toraobject'),            
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
            urljoin(this.serverUrl, 'toraobject', 'count'),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public getById(id: number, query?: Query, progressListener?: any): Observable<ToraObject> {
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'toraobject', id),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public createOrUpdate(model: ToraObject, progressListener?: any): Observable<number> {
        if (!model['id']) {
            return this.create(model, progressListener);
        } else if (model['id']) {
            return this.update(model, progressListener);       
        }
    }

    public create(model: ToraObject, progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'toraobject'),            
            model,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public update(model: ToraObject, progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'PUT',
            urljoin(this.serverUrl, 'toraobject'),
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
            urljoin(this.serverUrl, 'toraobject', id),
            null,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public upload(model: FormData, progressListener?: any): Observable<ToraObject> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        options.headers.delete('Content-Type');                
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'toraobject', 'upload'),
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
            urljoin(this.serverUrl, 'toraobject', 'download', id.toString()),
            null,
            progressListener,
            null,
        );

        return request.catch(this.handleError)
    }
    
    public getSummary(id: string, query?: Query, progressListener?: any): Observable<DashboardDataViewModel[]> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'toraobject', 'summary', encodeURIComponent(id)),
            null,
            progressListener,
            null,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public calculateAll(query?: Query, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'toraobject', 'calculate', 'all'),
            null,
            progressListener,
            null,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public calculate(id: number, query?: Query, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'toraobject', 'calculate', id.toString()),
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