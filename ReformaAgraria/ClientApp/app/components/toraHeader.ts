import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../services/shared';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'ra-tora-header',
    templateUrl: '../templates/toraHeader.html',
})
export class ToraHeaderComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    toraSummary: any[];
    totalObjects: number;
    totalSubjects: number;
    totalSize: number;

    constructor(
        private sharedService: SharedService
    ) { }

    ngOnInit(): void {
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
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }    
}