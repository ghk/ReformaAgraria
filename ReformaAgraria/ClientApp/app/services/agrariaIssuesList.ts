import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from './../services/shared';
import { ProgressHttp } from 'angular-progress-http';
import { ToraObject } from './../models/gen/toraObject';

import 'rxjs/add/operator/map'
import * as urljoin from 'url-join';

import { RequestHelper } from '../helpers/request';
import { Query } from "../models/query";

@Injectable()
export class AgrariaIssuesListService {
    private serverUrl: string;

    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private sharedService: SharedService
    ) {
        this.serverUrl = this.sharedService.getEnvironment().serverUrl;
    }
    
    import(event, regionId) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            let headers = new Headers();
            headers.append('Accept', 'application/json');
            let requestOptions = new RequestOptions({ headers: headers });
            return this.http.post('/api/toraobject/import', formData, requestOptions)
                .map(res => res.json())
        }
    }

    public getAllObject(query?: Query, progressListener?: any): Observable<Array<ToraObject>> {
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

    public getAllSubject(query?: Query, progressListener?: any): Observable<Array<ToraObject>> {
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'GET',
            urljoin(this.serverUrl, 'torasubject'),
            query,
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