import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ProgressHttp } from "angular-progress-http";

import 'rxjs/add/operator/map'
import * as urljoin from 'url-join';

import { LoginViewModel as User } from '../models/gen/loginViewModel';
import { RequestHelper } from '../helpers/request';
import { SharedService } from './shared';


@Injectable()
export class AccountService {
    constructor(
        private http: Http,
        private cookieService: CookieService,
        private sharedService: SharedService,
        private progressHttp: ProgressHttp
    ) { }

    login(user: User) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.post('/api/account/login', user, requestOptions)
            .map(response => {                
                let resp = response.json();
                if (resp && resp.data && resp.data.accessToken) {
                    this.cookieService.set('accessToken', resp.data.accessToken, 30, '/');                 
                }
                return resp.data;
            })
            .catch(this.handleError);
    }
    
    logout() {
        //let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        //await this.http.post('/api/account/logout', null).toPromise();
        this.cookieService.deleteAll('/');
    }

    register(user: User) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.post('/api/account/register', user, requestOptions)
            .catch(this.handleError);
    }

    sendPasswordRecoveryLink(user: User) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.post('/api/account/password/recovery', user, requestOptions)
            .catch(this.handleError);
    }

    resetPassword(id: string, token: string, password: string) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        let body = { 'password': password };
        return this.http.post('/api/account/password/reset/' + id + '/' + token, body, requestOptions);
    }

    changePassword(id: string, newPassword: string) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        let body = { 'newPassword': newPassword };
        return this.http.post('/api/account/password/change/' + id, body, requestOptions);
    }

    getAllUser() {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.get('/api/account/user', requestOptions)
            .map(res => res.json());
    }

    getUserById(id: string) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.get('/api/account/user/' + id, requestOptions)
            .map(res => res.json());
    }

    deleteUser(id: string) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.delete('/api/account/user/' + id, requestOptions);
    }

    updateUser(id: string, newEmail: string) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        let body = { "email": newEmail };
        return this.http.put('/api/account/user/' + id, body, requestOptions);
    }

    private handleError(error: Response) {        
        return Observable.throw(error);
    }
}