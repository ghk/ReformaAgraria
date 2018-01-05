import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestHelper } from "../helpers/request";
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from '../services/shared';

@Component({
    selector: 'ra-agraria-issues-header',
    templateUrl: '../templates/agrariaIssuesHeader.html',
})
export class AgrariaIssuesHeaderComponent implements OnInit, OnDestroy {
    toraSummary: any[];
    totalObjects: number;
    totalSubjects: number;
    totalSize: number;

    constructor(
        private http: Http,
        private cookieService: CookieService,
        private sharedService: SharedService) { }

    ngOnInit(): void {
        this.sharedService.getToraSummary().subscribe(data => {
            this.toraSummary = data;
            this.totalObjects = 0;
            this.totalSize = 0;

            for (var i = 0; i < this.toraSummary.length; i++) {
                this.totalObjects += this.toraSummary[i].totalToraObjects;
                this.totalSubjects += this.toraSummary[i].totalToraSubjects;
                this.totalSize += this.toraSummary[i].totalSize;
            }
        })
    }

    ngOnDestroy(): void {

    }

    import() {
        let requestOptions = RequestHelper.getRequestOptions(this.cookieService, null);
        return this.http.get('/api/torasubject/import', requestOptions)
            .map(res => res.json());
    }
}