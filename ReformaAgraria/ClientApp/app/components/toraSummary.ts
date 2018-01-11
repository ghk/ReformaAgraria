import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { RegionType } from '../models/gen/regionType';
import { RegionService } from '../services/gen/region';
import { ToraService } from '../services/tora';
import { SharedService } from '../services/shared';
import { CookieService } from 'ngx-cookie-service';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Region } from '../models/gen/region';

@Component({
    selector: 'ra-tora-summary',
    templateUrl: '../templates/toraSummary.html'
})
export class ToraSummaryComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    summaries: any = [];
    region: Region;
    loading: boolean = true;    
    order: string = "region.name";

    constructor(
        private regionService: RegionService,
        private sharedService: SharedService,
        private toraService: ToraService
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
        this.toraService.getToraObjectSummaries(region.id).subscribe(data => {
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
