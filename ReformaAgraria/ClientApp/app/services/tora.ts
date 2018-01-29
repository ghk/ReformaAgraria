import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { ProgressHttp } from 'angular-progress-http';

import { EnvironmentService } from './../services/environment';
import { RequestHelper } from '../helpers/request';
import { Query } from "../models/query";
import { UploadToraDocumentViewModel } from '../models/gen/uploadToraDocumentViewModel';
import { ToraObject } from './../models/gen/toraObject';

import 'rxjs/add/operator/map'
import * as urljoin from 'url-join';


@Injectable()
export class ToraService {
    private serverUrl: string;

    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private environmentService: EnvironmentService
    ) {
        this.serverUrl = this.environmentService.getEnvironment().serverUrl;
    }

    getSummaries(id: string, progressListener?: any) {
        let options = RequestHelper.getRequestOptions(this.cookieService, null)
        let request = RequestHelper.getHttpRequest(            
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'toraobject', 'summary', id),            
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }   

    import(model: any, progressListener?: any) {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        options.headers.delete('Content-Type');
        
        let request = RequestHelper.getHttpRequest(                        
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'toraobject', 'import'),            
            model,
            null,
            progressListener
        );
        
        return request.map(res => res.json()).catch(this.handleError);
    }

    exportObject(toraObject: any, progressListener?: any) {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        options.headers.delete('Content-Type');

        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'toraobject', 'export'),
            toraObject,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            try {
                var body = error.json() || '';
                var err = null;
                if (body.message != undefined) {
                    err = body.message;
                    //errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
                }
                else if (body.description != undefined) {
                    err = body.description;
                }
                else {
                    err = JSON.stringify(body);
                }
                errMsg = `${err}`;
            } catch (e) {
                errMsg = `Unable to perform this request`;
            }
        } else {
            errMsg = 'Unable to perform this request';
        }
        return Observable.throw(errMsg);
    }
}