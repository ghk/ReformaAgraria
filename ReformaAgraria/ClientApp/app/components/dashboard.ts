import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegionService } from "../services/gen/region";
import { SharedService } from "../services/shared";
import { Subscription } from 'rxjs';

@Component({
    selector: 'ra-dashboard',
    templateUrl: '../templates/dashboard.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    constructor(
        private _sharedService: SharedService
    ) { }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
    }

}