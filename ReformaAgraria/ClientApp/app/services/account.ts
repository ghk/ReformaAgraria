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
        return this.http.post('/api/account/sendpasswordrecoverylink', user, requestOptions)
            .catch(this.handleError);
    }

    resetPassword(id: string, token: string, password: string) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        let params = new URLSearchParams();
        params.append('id', id);
        params.append('token', token);
        params.append('password', password);
        requestOptions.params = params;
        return this.http.post('/api/account/resetpassword', params)
            .map(res => res.json());
    }

    changePassword(id: string, currentPassword: string, newPassword: string) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        let params = new URLSearchParams();
        params.append('id', id);
        params.append('currentPassword', currentPassword);
        params.append('newPassword', newPassword);
        requestOptions.params = params;
        return this.http.post('/api/account/changepassword', params)
            .map(res => res.json());
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
        return this.http.put('/api/account/user/' + id, body);
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