import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestOptions } from "@angular/http/http";

import { AgrariaIssuesListService } from '../services/agrariaIssuesList';
import { CookieService } from 'ngx-cookie-service';
import { AlertService } from '../services/alert';
import { SharedService } from '../services/shared';
import { LandStatus } from '../models/gen/landStatus';
import { RegionalStatus } from '../models/gen/regionalStatus';

@Component({
    selector: 'ra-agraria-issues-list',
    templateUrl: '../templates/agraria-issues-list.html',
})
export class AgrariaIssuesListComponent implements OnInit, OnDestroy {
    issueLists: any = [];
    LandStatus = LandStatus;
    RegionalStatus = RegionalStatus;
    regionId = this.cookieService.get('regionId');
    reloaded: boolean = false;

    constructor(
        private agrariaIssuesList: AgrariaIssuesListService,
        private cookieService: CookieService,
        private alertService: AlertService,
        private sharedService: SharedService
    ) { }

    ngOnInit(): void {
        this.sharedService.getIsAgrariaIssuesListReloaded().subscribe(reloaded => {
            this.reloaded = reloaded;
            this.sharedService.getRegionId().subscribe(id => {
                this.getIssuesList(id);
            });
        });
    }

    ngOnDestroy(): void {

    }

    fileChange(event) {
        this.agrariaIssuesList.import(event, this.regionId)
            .subscribe(
            data => this.alertService.success('File is successfully uploaded', true),
            error => this.alertService.error(error)
            );
    }

    getIssuesList(id) {
        let query = { data: { 'type': 'getAllById', 'id': id } }
        this.agrariaIssuesList.getAll(query, null).subscribe(data => this.issueLists = data);
    }



}