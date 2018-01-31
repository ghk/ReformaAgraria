import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';

import 'rxjs/add/operator/map'
import * as urljoin from 'url-join';

import { LoginViewModel as User } from '../models/gen/loginViewModel';
import { RequestHelper } from '../helpers/request';
import { ProgressHttp } from "angular-progress-http";

@Injectable()
export class AccountService {
    constructor(
        private http: Http,
        private cookieService: CookieService,
        private progressHttp: ProgressHttp
    ) { }

    login(user: User) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.post('/api/account/login', user, requestOptions)
            .map(response => {                
                let resp = response.json();
                if (resp && resp.data && resp.data.accessToken) {
                    this.cookieService.set('accessToken', resp.data.accessToken);
                    this.cookieService.set('currentUser', resp.data.email);
                }
                return resp.data;
            })
            .catch(this.handleError);
    }
    
    logout() {
        this.cookieService.delete('accessToken');
        this.cookieService.delete('currentUser');
        return this.http.post('/api/account/logout', null)
            .catch(this.handleError);
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
        let params = new URLSearchParams();
        params.append('id', id);
        params.append('token', token);
        params.append('password', password);
        requestOptions.params = params;
        return this.http.post('/api/account/password/reset', params, requestOptions);
    }

    changePassword(id: string, newPassword: string) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        let params = new URLSearchParams();
        params.append('id', id);
        params.append('newPassword', newPassword);
        requestOptions.params = params;
        return this.http.post('/api/account/password/change', params, requestOptions);
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

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            try {
                var body = error.json() || '';
                if (body.length > 1) {
                    body = body[1];
                }
                var err = null;
                if (body.message != undefined) {
                    err = body.message;
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