import { Injectable } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProgressHttp } from 'angular-progress-http';
import { CookieService } from 'ngx-cookie-service';

import { Query } from '../../models/query';
import { Library } from '../../models/gen/library';
import { ImportLibraryViewModel } from '../../models/gen/importLibraryViewModel';
import { EnvironmentService } from '../../services/environment';
import { CrudService } from '../../services/crud';
import { RequestHelper } from '../../helpers/request';

import * as urljoin from 'url-join';

@Injectable()
export class LibraryService implements CrudService<Library, number>{        

    private serverUrl: string;
   
    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private environmentService: EnvironmentService) { 
        this.serverUrl = this.environmentService.getEnvironment().serverUrl;
    }

    public getAll(query?: Query, progressListener?: any): Observable<Array<Library>> { 
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'library'),            
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
            urljoin(this.serverUrl, 'library', 'count'),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public getById(id: number, query?: Query, progressListener?: any): Observable<Library> {
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'library', id),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public createOrUpdate(model: Library, progressListener?: any): Observable<number> {
        if (!model['id']) {
            return this.create(model, progressListener);
        } else if (model['id']) {
            return this.update(model, progressListener);       
        }
    }

    public create(model: Library, progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'library'),            
            model,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public update(model: Library, progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'PUT',
            urljoin(this.serverUrl, 'library'),
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
            urljoin(this.serverUrl, 'library', id),
            null,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public upload(model: FormData, progressListener?: any): Observable<Library> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        options.headers.delete('Content-Type');                
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'library', 'upload'),
            model,
            null,
            progressListener,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public delete(id: number, progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'DELETE',
            urljoin(this.serverUrl, 'library', 'delete', id),
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