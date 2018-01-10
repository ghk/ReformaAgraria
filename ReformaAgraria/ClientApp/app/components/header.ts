import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";

import { AccountService } from '../services/account';
import { SharedService } from '../services/shared';
import { Region } from "../models/gen/region";
import { RegionService } from '../services/gen/region';

@Component({
    selector: 'ra-header',
    templateUrl: '../templates/header.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
    region: Region;
    subscription: Subscription;

    constructor(
        private router: Router,
        private regionService: RegionService,
        private accountService: AccountService,
        private sharedService: SharedService
    ) { }

    ngOnInit(): void {
        this.subscription = this.sharedService.getRegion().subscribe(region => {
            let depth = region.type - 2;
            let breadcrumbQuery = { 
                'data': {
                    'type': 'breadcrumb',
                    'depth': depth
                }
            };
            
            this.regionService.getById(region.id, breadcrumbQuery, null).subscribe(region => {
                this.region = region;
            })
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    logout(): void {
        this.accountService.logout().subscribe();
        this.router.navigateByUrl('/account/login');
    }

    openNav() {
        document.getElementById("mySidenav").style.width = "250px";
    }

    closeNav() {
        document.getElementById("mySidenav").style.width = "0";
    }

    convertRegionId(text) {
        return text.split('.').join('_');
    }

}