import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegionService } from "../services/gen/region";
import { SharedService } from "../services/shared";

@Component({
    selector: 'ra-dashboard',
    templateUrl: '../templates/dashboard.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    constructor(
        private _regionService: RegionService,
        private _sharedService: SharedService
    ) { }

    ngOnInit(): void {
        let query = { data: { 'type': 'breadcrumb', 'depth': 0 } }
        this._regionService.getById('72.1', query).subscribe(region => {
            this._sharedService.setRegion(region);
        })
    }

    ngOnDestroy(): void {
    }

}