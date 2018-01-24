import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { ProgressHttp } from 'angular-progress-http';

import 'rxjs/add/operator/map'
import * as urljoin from 'url-join';

import { SharedService } from './../services/shared';
import { RequestHelper } from '../helpers/request';
import { Query } from "../models/query";


@Injectable()
export class MapNavigationService {
    private serverUrl: string;

    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private sharedService: SharedService
    ) {
        this.serverUrl = this.sharedService.getEnvironment().serverUrl;
    }

    import(model): Observable<any> {
        let fileList: FileList = model.file;
        if (fileList && fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            let headers = new Headers();
            let requestOptions = new RequestOptions({ headers: headers });

            headers.append('Accept', 'application/json');
            formData.append('toraObjectId', model.tora.id);
            formData.append('toraObjectName', model.tora.name);
            formData.append('regionId', model.desa.id);
            formData.append('uploadFile', file, file.name);

            return this.http.post('/api/toramap/import', formData, requestOptions)
                .map(res => res.json())
                .catch(this.handleError);
        }
    }

    download(toraId: number): Observable<any> {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        requestOptions.responseType = ResponseContentType.Blob;
        return this.http.get('/api/toramap/download/' + toraId, requestOptions)  
            .catch(this.handleError);     
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