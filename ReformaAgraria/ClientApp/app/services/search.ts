import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { SearchViewModel } from '../models/gen/searchViewModel';
import { Http } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { RequestHelper } from "../helpers/request";

@Injectable()
export class SearchService {
    
    constructor(
        private http: Http,
        private cookieService: CookieService
    ) { }

    search(keywords: string): Observable<Array<SearchViewModel>> {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.get('/api/search/' + keywords, requestOptions)
            .map(res => res.json())
            .catch(this.handleError);
    }

    searchRegion(keywords: string): Observable<Array<SearchViewModel>> {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.get('/api/search/region/' + keywords, requestOptions)
            .map(res => res.json())
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