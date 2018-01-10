import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { RegionType } from '../models/gen/regionType';
import { RegionService } from '../services/gen/region';
import { AgrariaIssuesListService } from '../services/agrariaIssuesList';
import { SharedService } from '../services/shared';
import { CookieService } from 'ngx-cookie-service';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Region } from '../models/gen/region';

@Component({
    selector: 'ra-region',
    templateUrl: '../templates/region.html'
})
export class RegionComponent implements OnInit, OnDestroy {
    regions: any = [];
    region: Region;

    id: string;
    parentId: string;
    model: any = {};
    breadcrumbs: any = [];
    loading: boolean = true;
    isDesc: boolean = false;
    prevColumn: string = "";
    subscription: Subscription;
    order: string = "region.name";

    constructor(
        private regionService: RegionService,
        private sharedService: SharedService,
        private agrariaIssuesListService: AgrariaIssuesListService
    ) { }

    ngOnInit() {
        this.subscription = this.sharedService.getRegion().subscribe(region => {
            this.region = region;
            this.getToraObjectSummary(region);
        });
    };

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getToraObjectSummary(region: Region) {
        this.agrariaIssuesListService.getToraObjectSummary(region.id).subscribe(data => {
            this.regions = data;
            this.sharedService.setToraSummary(data);
            this.loading = false;
        })
    }

    sort(order: string) {
        if (this.order.includes(order)) {
            if (this.order.startsWith('-'))
                this.order = this.order.substr(1);
            else
                this.order = '-' + this.order;
        } else {
            this.order = order;
        }
    }

    convertRegionId(text) {
        return text.split('.').join('_');
    }
}
