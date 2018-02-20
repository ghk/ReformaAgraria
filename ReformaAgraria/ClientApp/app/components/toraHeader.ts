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
    totalProposedObjects: number;
    totalVerifiedObjects: number;
    totalActualizedObject: number;
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
            this.totalProposedObjects = 0;
            this.totalVerifiedObjects = 0;
            this.totalActualizedObject = 0;

            for (var i = 0; i < this.toraSummary.length; i++) {
                this.totalObjects += this.toraSummary[i].totalToraObjects;
                this.totalSubjects += this.toraSummary[i].totalToraSubjects;
                this.totalSize += this.toraSummary[i].totalSize;
                this.totalProposedObjects += this.toraSummary[i].totalProposedObjects;
                this.totalVerifiedObjects += this.toraSummary[i].totalVerifiedObjects;
                this.totalActualizedObject += this.toraSummary[i].totalActualizedObjects;
            }

            this.loading = false;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }    
}