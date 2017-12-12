﻿import { Injectable } from '@angular/core';
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
import { CrudService } from "./crud";
import { BaseLayer } from "../models/gen/baselayer";
/*

@Injectable()
export class MapService implements CrudService<BaseLayer, string>{  
    getAll(query: Query, progressListener: any): Observable<BaseLayer[]> {
        throw new Error("Method not implemented.");
    }
    count(query: Query, progressListener: any): Observable<number> {
        throw new Error("Method not implemented.");
    }
    getById(id: string, progressListener: any): Observable<BaseLayer> {
        throw new Error("Method not implemented.");
    }
    createOrUpdate(model: BaseLayer, progressListener: any): Observable<number> {
        throw new Error("Method not implemented.");
    }
    create(model: BaseLayer, progressListener: any): Observable<number> {
        throw new Error("Method not implemented.");
    }
    update(model: BaseLayer, progressListener: any): Observable<number> {
        throw new Error("Method not implemented.");
    }
    deleteById(id: string, progressListener: any): Observable<number> {
        throw new Error("Method not implemented.");
    }
    private serverUrl: string;

    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private sharedService: SharedService
    ) {
        this.serverUrl = this.sharedService.getEnvironment().serverUrl;
    }

    import(model) {
        let fileList: FileList = model.file;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            let headers = new Headers();
            let requestOptions = new RequestOptions({ headers: headers });

            headers.append('Accept', 'application/json');
            formData.append('label', model.label);
            formData.append('color', model.color);
            formData.append('uploadFile', file, file.name);            
            
            return this.http.post('/api/map/import', formData, requestOptions)
                .map(res => res.json())
        }
    }

    getContent(callback){
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.get('/api/map/getall/', requestOptions)
            .subscribe(response => {
                let data = response.json();

                if (data.length && data.length > 0) {
                    data.forEach(result => {
                        result.geojson = JSON.parse(result.geojson);
                    })
                }
                console.log(data)
                callback(data);
            },
            error => {
                console.error(error);
            })
            
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
*/