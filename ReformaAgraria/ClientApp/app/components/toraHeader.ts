import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SharedService } from '../services/shared';
import { ToraObjectService } from "../services/gen/toraObject";
import { RegionService } from "../services/gen/region";

@Component({
    selector: 'ra-tora-header',
    templateUrl: '../templates/toraHeader.html',
})
export class ToraHeaderComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    stagesSubscription: Subscription;
    regionSubscription: Subscription;
    toraSummary: any[];
    totalObjects: number;
    totalSubjects: number;
    totalSize: number;
    proposal: number;
    verification: number;
    act: number;
    loading: boolean = false;

    constructor(
        private sharedService: SharedService,
        private toraObjectService: ToraObjectService,
        private regionService: RegionService
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.subscription = this.sharedService.getToraSummary().subscribe(data => {
            this.toraSummary = data;
            this.totalObjects = 0;
            this.totalSubjects = 0;
            this.totalSize = 0;

            for (var i = 0; i < this.toraSummary.length; i++) {
                this.totalObjects += this.toraSummary[i].totalToraObjects;
                this.totalSubjects += this.toraSummary[i].totalToraSubjects;
                this.totalSize += this.toraSummary[i].totalSize;
            }

            this.regionSubscription = this.sharedService.getRegion().subscribe(region => {
                let query1 = { data: { 'type': 'getByStatus', 'status': 0 } }
                this.stagesSubscription = this.toraObjectService.getAll(query1, null).subscribe(data => {
                    this.proposal = data.length;
                });
                let query2 = { data: { 'type': 'getByStatus', 'status': 1 } }
                this.stagesSubscription = this.toraObjectService.getAll(query2, null).subscribe(data => {
                    this.verification = data.length;
                });
                let query3 = { data: { 'type': 'getByStatus', 'status': 2 } }
                this.stagesSubscription = this.toraObjectService.getAll(query3, null).subscribe(data => {
                    this.act = data.length;
                });
            }); 

            this.loading = false;
        });

        
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }    
}