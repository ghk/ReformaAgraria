import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SharedService } from '../services/shared';
import { RegionService } from '../services/gen/region';
import { Region } from '../models/gen/region';

@Component({
    selector: 'ra-sidenav',
    templateUrl: '../templates/sidenav.html',
})
export class SidenavComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    region: Region;
    regionId: string;
    
    constructor(
        private sharedService: SharedService
    ) { }

    ngOnInit(): void {       
        this.subscription = this.sharedService.getRegion().subscribe(region => {
            this.region = region;
            this.regionId = region.id.split('.').join('_');
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    
}