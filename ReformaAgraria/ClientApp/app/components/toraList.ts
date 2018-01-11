import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestHelper } from "../helpers/request";
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from '../services/shared';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'ra-tora-list',
    templateUrl: '../templates/toraList.html',
})
export class ToraListComponent implements OnInit, OnDestroy {
    subscription: Subscription;

    constructor(
        private http: Http,
        private cookieService: CookieService,
        private sharedService: SharedService) { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    import() {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.get('/api/torasubject/import', requestOptions)
            .map(res => res.json());
    }
}