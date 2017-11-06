import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestHelper } from "../helpers/request";
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'ra-agraria-issues-header',
    templateUrl: '../templates/agraria-issues-header.html',
})
export class AgrariaIssuesHeaderComponent implements OnInit, OnDestroy {

    constructor(
        private http: Http,
        private cookieService: CookieService) { }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    import() {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.get('/api/torasubject/import', requestOptions)
            .map(res => res.json());
    }
}