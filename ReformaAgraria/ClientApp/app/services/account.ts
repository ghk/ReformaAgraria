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

    login(user: User) {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService);
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
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService);
        return this.http.post('/api/account/register', user, requestOptions)
            .catch(this.handleError);
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