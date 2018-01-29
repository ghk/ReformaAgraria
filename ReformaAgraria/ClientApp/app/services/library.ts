import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { ProgressHttp } from "angular-progress-http";
import { RequestHelper } from "../helpers/request";
import { CookieService } from "ngx-cookie-service";
import { SharedService } from "./shared";
import { Query } from "../models/query";
import { Observable } from "rxjs/Observable";
import { Library } from "../models/gen/library";

import * as urljoin from 'url-join';

@Injectable()
export class LibraryService {
    private serverUrl: string;

    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private sharedService: SharedService
    ) {
        this.serverUrl = this.sharedService.getEnvironment().serverUrl;
    }

    public getAll(query?: Query, progressListener?: any): Observable<Array<Library>> {
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'library'),
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public delete(id: number, progressListener?: any): Observable<number> {
        let formData: FormData = new FormData();
        let headers = new Headers();
        let requestOptions = new RequestOptions({ headers: headers });
        headers.append('Accept', 'application/json');
        formData.append('id', id.toString());
        return this.http.post('/api/library/delete', formData, requestOptions).catch(this.handleError);
    }

    public upload(model, progressListener?: any): Observable<number> {
        let fileList: FileList = model.file;
        console.log(fileList);
        if (fileList.length && fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            let headers = new Headers();
            let requestOptions = new RequestOptions({ headers: headers });

            headers.append('Accept', 'application/json');
            formData.append('title', model.title);
            formData.append('uploadFile', file, file.name); 

            return this.http.post('/api/library/upload', formData, requestOptions)
                .map(res => res.json()).catch(this.handleError);
        }
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}