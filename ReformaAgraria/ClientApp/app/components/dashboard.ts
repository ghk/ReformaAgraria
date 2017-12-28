import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegionService } from "../services/gen/region";
import { SharedService } from "../services/shared";
import { Subscription } from 'rxjs';

@Component({
    selector: 'ra-dashboard',
    templateUrl: '../templates/dashboard.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    subscription: Subscription;
    constructor(
        private _regionService: RegionService,
        private _sharedService: SharedService
    ) { }

    ngOnInit(): void {
        let query = { data: { 'type': 'breadcrumb', 'depth': 0 } }
        this.subscription = this._regionService.getById('72_1', query).subscribe(region => {
            this._sharedService.setRegion(region);
        })
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}