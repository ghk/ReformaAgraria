import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";

import { AccountService } from '../services/account';
import { SharedService } from '../services/shared';
import { Region } from "../models/gen/region";
import { RegionService } from '../services/gen/region';
import { Observable } from 'rxjs/Observable';
import { SearchService } from '../services/search';
import { SearchViewModel } from '../models/gen/searchViewModel';

@Component({
    selector: 'ra-header',
    templateUrl: '../templates/header.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
    region: Region;
    regionId: string = '72_1';
    selected: any;
    dataSource: any;
    subscription: Subscription;

    constructor(
        private router: Router,
        private regionService: RegionService,
        private accountService: AccountService,
        private searchService: SearchService,
        private sharedService: SharedService
    ) { }

    ngOnInit(): void {
        this.subscription = this.sharedService.getRegion().subscribe(region => {
            this.regionId = region.id.split('.').join('_');
            console.log(this.regionId);
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

        this.dataSource = Observable.create((observer: any) => {
            observer.next(this.selected);
        }).mergeMap((keywords: string) => this.searchService.search(keywords));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    navigate(moduleName) {
        if (moduleName == 'home' || moduleName == 'calendar') {
            this.router.navigateByUrl(moduleName + '/' + this.regionId);
        }
        else {
            this.router.navigateByUrl(moduleName + '/');
        }
        this.closeNav();
    }

    onSearchSelected(model: any) {
        let svm: SearchViewModel = model.item;
        if (svm.type === 3)        
            this.router.navigateByUrl('toradetail/' + svm.value);
        else {
            let regionId = svm.value.replace(/\./g, '_');
            this.router.navigateByUrl('home/' + regionId);
        }
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