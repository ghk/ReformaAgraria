import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { EnvironmentService } from './../services/environment';
import { ProgressHttp } from 'angular-progress-http';
import { ToraObject } from './../models/gen/toraObject';
import { RequestHelper } from '../helpers/request';
import { Query } from "../models/query";
import { CrudService } from "./crud";
import { BaseLayerService } from "./gen/baseLayer";

import 'rxjs/add/operator/map'
import * as urljoin from 'url-join';

@Injectable()
export class MapService {  
    private serverUrl: string;

    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private environmentService: EnvironmentService
    ) { 
        this.serverUrl = this.environmentService.getEnvironment().serverUrl;
    }

    import(model): Observable<any> {
        let fileList: FileList = model.file;
        if (fileList && fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            let headers = new Headers();
            let requestOptions = new RequestOptions({ headers: headers });
            requestOptions.headers.delete('Content-Type');

            headers.append('Accept', 'application/json');
            if (model.id)
                formData.append('id', model.id);
            formData.append('label', model.label);
            formData.append('color', model.color);
            formData.append('uploadFile', file, file.name);            
            
            return this.http.post('/api/baselayer/import', formData, requestOptions)
                .map(res => res.json())
                .catch(this.handleError);
        }
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