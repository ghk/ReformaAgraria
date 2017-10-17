import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';

import 'rxjs/add/operator/map'

import { User } from '../models/user';
import { RequestHelper } from '../helpers/request';

@Injectable()
export class AccountService {
    constructor(
        private http: Http,
        private cookieService: CookieService
    ) { }

    login(username: string, password: string) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService);
        return this.http.post('/api/account/login', { UserName: username, PasswordHash: password }, requestOptions)
            .map(response => {                
                let resp = response.json();
                if (resp && resp.data && resp.data.accessToken) {
                    this.cookieService.set('accessToken', resp.data.accessToken);
                    this.cookieService.set('currentUser', resp.data.userName);
                }
                return resp;
            });
    }
    
    logout() {
        this.cookieService.delete('accessToken');
        this.cookieService.delete('currentUser');
        return this.http.post('/api/account/logout', null);
    }

    register(user: User) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService);
        return this.http.post('/api/account/register', user, requestOptions).map(response => response.json());
    }

}