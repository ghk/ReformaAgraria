import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from './../services/shared';
import { ProgressHttp } from 'angular-progress-http';
import { ToraObject } from './../models/gen/toraObject';
import { RequestHelper } from '../helpers/request';
import { Query } from "../models/query";

import 'rxjs/add/operator/map'
import * as urljoin from 'url-join';


@Injectable()
export class ToraService {
    private serverUrl: string;

    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private sharedService: SharedService
    ) {
        this.serverUrl = this.sharedService.getEnvironment().serverUrl;
    }

    getToraObjectSummaries(id: string) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.get('/api/toraobject/summary/' + id, requestOptions)
            .map(res => res.json())
    }

    editToraObject(model) {
        let formData: FormData = new FormData();
        formData.append('id', model.id);
        formData.append('conflictChronology', model.conflictChronology);
        formData.append('fkRegionId', model.fkRegionId);
        formData.append('formalAdvocacyProgress', model.formalAdvocacyProgress);
        formData.append('nonFormalAdvocacyProgress', model.nonFormalAdvocacyProgress);
        formData.append('landStatus', model.landStatus);
        formData.append('landTenureHistory', model.landTenureHistory);
        formData.append('landType', model.landType);
        formData.append('livelihood', model.livelihood);
        formData.append('name', model.name);
        formData.append('proposedTreatment', model.proposedTreatment);
        formData.append('regionalStatus', model.regionalStatus);
        formData.append('size', model.size);
        formData.append('stages', model.stages);
        formData.append('totalTenants', model.totalTenants);
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        let requestOptions = new RequestOptions({ headers: headers });
        return this.http.post('/api/toraobject/edit', formData, requestOptions)
            .map(res => res.json())
    }

    addToraObject(model) {
        let formData: FormData = new FormData();
        formData.append('conflictChronology', model.conflictChronology);
        formData.append('fkRegionId', model.fkRegionId);
        formData.append('formalAdvocacyProgress', model.formalAdvocacyProgress);
        formData.append('nonFormalAdvocacyProgress', model.nonFormalAdvocacyProgress);
        formData.append('landStatus', model.landStatus);
        formData.append('landTenureHistory', model.landTenureHistory);
        formData.append('landType', model.landType);
        formData.append('livelihood', model.livelihood);
        formData.append('name', model.name);
        formData.append('proposedTreatment', model.proposedTreatment);
        formData.append('regionalStatus', model.regionalStatus);
        formData.append('size', model.size);
        formData.append('stages', model.stages);
        formData.append('totalTenants', model.totalTenants);
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        let requestOptions = new RequestOptions({ headers: headers });
        return this.http.post('/api/toraobject/add', formData, requestOptions)
            .map(res => res.json())
    }

    importToraObject(event, regionId) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            formData.append('regionId', regionId);
            let headers = new Headers();
            headers.append('Accept', 'application/json');
            let requestOptions = new RequestOptions({ headers: headers });
            return this.http.post('/api/toraobject/import', formData, requestOptions)
                .map(res => res.json())
        }
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