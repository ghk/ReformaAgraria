import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SharedService } from '../services/shared';
import { RegionService } from '../services/gen/region';
import { Region } from '../models/gen/region';

@Component({
    selector: 'ra-home',
    templateUrl: '../templates/home.html',
})
export class HomeComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    region: Region;

    constructor(
        private sharedService: SharedService,
        private regionService: RegionService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {        
        this.subscription = this.route.params.subscribe(params => {
            let regionId: string = params['id'] !== null ? params['id'] : '72.1';
            regionId = regionId.replace(/_/g, '.');
            this.regionService.getById(regionId, null, null).subscribe(region => {
                this.region = region;
                this.sharedService.setRegion(region);
            })
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}