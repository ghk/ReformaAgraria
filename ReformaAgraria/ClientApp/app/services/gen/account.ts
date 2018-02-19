import { Injectable } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProgressHttp } from 'angular-progress-http';
import { CookieService } from 'ngx-cookie-service';

import { Query } from '../../models/query';
import { LoginViewModel } from '../../models/gen/loginViewModel';
import { UserViewModel } from '../../models/gen/userViewModel';
import { EnvironmentService } from '../../services/environment';

import { RequestHelper } from '../../helpers/request';

import * as urljoin from 'url-join';

@Injectable()
export class AccountService {        

    private serverUrl: string;
   
    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private environmentService: EnvironmentService) { 
        this.serverUrl = this.environmentService.getEnvironment().serverUrl;
    }
    
    public login(model: LoginViewModel, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'account', 'login'),
            model,
            null,
            progressListener,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public register(model: LoginViewModel, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'account', 'register'),
            model,
            null,
            progressListener,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public logout(query?: Query, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'account', 'logout'),
            null,
            progressListener,
            null,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public recoverPassword(model: LoginViewModel, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'account', 'password', 'recover'),
            model,
            null,
            progressListener,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public resetPassword(email: string, token: string, query?: Query, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'account', 'password', 'reset?email=', encodeURIComponent(email), '&token=', encodeURIComponent(token)),
            null,
            progressListener,
            null,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public changePassword(email: string, model: { [key: string]: string; }, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, 'account', 'password', 'change', encodeURIComponent(email)),
            model,
            null,
            progressListener,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public getAll(query?: Query, progressListener?: any): Observable<UserViewModel[]> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'account', 'user'),
            null,
            progressListener,
            null,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public getById(id: string, query?: Query, progressListener?: any): Observable<UserViewModel> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, 'account', 'user', encodeURIComponent(id)),
            null,
            progressListener,
            null,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public deleteById(id: string, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'DELETE',
            urljoin(this.serverUrl, 'account', 'user', encodeURIComponent(id)),
            null,
            progressListener,
            null,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    public updateUserEmail(id: string, model: { [key: string]: string; }, progressListener?: any): Observable<any> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
                        
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'PUT',
            urljoin(this.serverUrl, 'account', 'user', encodeURIComponent(id)),
            model,
            null,
            progressListener,
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    
    private handleError(error: Response) {
        return Observable.throw(error);
    }
}