import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SharedService } from '../services/shared';
import { Region } from '../models/gen/region';
import { RegionService } from '../services/gen/region';

@Component({
    selector: 'ra-sidenav',
    templateUrl: '../templates/sidenav.html',
})
export class SidenavComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    region: Region;
    regionId: string;
    
    constructor(
        private sharedService: SharedService,
        private regionService: RegionService
    ) { }

    ngOnInit(): void {        
        this.regionService.getById('72.1', null, null).subscribe(region => {
            this.region = region;
            this.regionId = region.id.replace(/\./g, '_');
        });
        this.subscription = this.sharedService.getRegion().subscribe(region => {
            this.region = region;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}