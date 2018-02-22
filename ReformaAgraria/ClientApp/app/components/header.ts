import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from "rxjs";
import { CookieService } from 'ngx-cookie-service';

import { Region } from "../models/gen/region";
import { SearchViewModel } from '../models/gen/searchViewModel';


import { SharedService } from '../services/shared';
import { AccountService } from '../services/gen/account';
import { RegionService } from '../services/gen/region';
import { SearchService } from '../services/gen/search';


@Component({
    selector: 'ra-header',
    templateUrl: '../templates/header.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
    region: Region;
    regionId: string;
    selected: any;
    dataSource: any;
    subscription: Subscription;

    constructor(
        private router: Router,
        private cookieService: CookieService,
        private regionService: RegionService,
        private accountService: AccountService,
        private searchService: SearchService,
        private sharedService: SharedService
    ) { }

    ngOnInit(): void {
        this.subscription = this.sharedService.getRegion().subscribe(region => {
            this.regionId = region.id.split('.').join('_');
            let depth = region.type - 2;
            let depthQuery = { 'data': { 'type': 'getByDepth', 'depth': depth } };
            this.regionService.getById(region.id, depthQuery, null).subscribe(region => {
                this.region = region;
            });
        });

        this.dataSource = Observable.create((observer: any) => { observer.next(this.selected); })
            .switchMap((keywords: string) => this.searchService.search(keywords))
            .catch((error: any) => { return []; });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSearchSelected(model: any) {
        let svm: SearchViewModel = model.item;
        if (svm.type === 3)
            this.router.navigateByUrl('toradetail/' + svm.value);
        else {
            let regionId = svm.value.id.replace(/\./g, '_');
            this.router.navigateByUrl('home/' + regionId);
        }
    }

    logout(): void {
        this.accountService.logout().subscribe(x => this.cookieService.deleteAll('/'));
        this.router.navigateByUrl('/account/login');
    }

    convertRegionId(text) {
        return text.split('.').join('_');
    }

}