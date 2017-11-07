﻿import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../services/shared';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'ra-home',
    templateUrl: '../templates/home.html',
})
export class HomeComponent implements OnInit, OnDestroy {
    sub: any;

    constructor(
        private sharedService: SharedService,
        private route: ActivatedRoute,
        public router: Router
    ) { }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.sharedService.setRegionId(params['id'] != null ? params['id'] : '72.1');
            });
    }


    ngOnDestroy(): void {

    }

}