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
    
    public deleteObject(id: number) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.delete('/api/toraobject/delete/' + id, requestOptions);
    }

    public getToraObjectSummary(id: string) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.get('/api/toraobject/summary/' + id, requestOptions)
            .map(res => res.json())
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