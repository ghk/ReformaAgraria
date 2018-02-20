import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { Region } from '../models/gen/region';
import { RegionType } from '../models/gen/regionType';

import { SharedService } from '../services/shared';
import { RegionService } from '../services/gen/region';
import { ToraObjectService } from '../services/gen/toraObject';


@Component({
    selector: 'ra-tora-summary',
    templateUrl: '../templates/toraSummary.html'
})
export class ToraSummaryComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    region: Region;
    RegionType: RegionType;

    summaries: any = [];

    loading: boolean = true;
    order: string = "region.name";

    constructor(
        private regionService: RegionService,
        private sharedService: SharedService,
        private toraObjectService: ToraObjectService
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
        this.toraObjectService.getSummary(region.id).subscribe(data => {
            console.log(data);
            this.summaries = data;
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
