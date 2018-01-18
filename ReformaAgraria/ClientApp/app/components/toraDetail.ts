import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../services/shared';
import { Subscription } from 'rxjs/Subscription';
import { RegionService } from '../services/gen/region';
import { Region } from '../models/gen/region';
import { ToraObjectService } from '../services/gen/toraObject';
import { ToraSubjectService } from '../services/gen/toraSubject';
import { ToraObject } from '../models/gen/toraObject';
import { ToraSubject } from '../models/gen/toraSubject';
import { Query } from '../models/query';
import { RegionalStatus } from '../models/gen/regionalStatus';
import { LandStatus } from '../models/gen/landStatus';
import { EducationalAttainment } from '../models/gen/educationalAttainment';
import { MaritalStatus } from '../models/gen/maritalStatus';
import { Gender } from '../models/gen/gender';
import { ToraService } from '../services/tora';

@Component({
    selector: 'ra-tora-detail',
    templateUrl: '../templates/toraDetail.html',
})
export class ToraDetailComponent implements OnInit, OnDestroy {        
    RegionalStatus = RegionalStatus;   
    LandStatus = LandStatus;
    EducationalAttainment = EducationalAttainment;
    MaritalStatus = MaritalStatus;
    Gender = Gender;

    subscription: Subscription; 
    toraObject: ToraObject;
    toraSubjects: ToraSubject[];

    constructor(
        private route: ActivatedRoute,
        private sharedService: SharedService,
        private regionService: RegionService,
        private toraService: ToraService,
        private toraObjectService: ToraObjectService,
        private toraSubjectService: ToraSubjectService
    ) { }

    ngOnInit(): void {
        this.subscription = this.route.params.subscribe(params => {
            let toraId = params['id'];            
            this.getData(toraId);            
        });
    }

    getData(toraId: number): void {        
        let toraSubjectQuery: Query = {
            data: {
                type: 'getAllByToraObjectId',
                toraObjectId: toraId
            }
        };

        this.toraObjectService.getById(toraId, null, null).subscribe(toraObject => {
            if (!toraObject)
                return;                

            this.toraObject = toraObject;

            if (!this.sharedService.region) {
                this.regionService.getById(toraObject.fkRegionId).subscribe(region => {
                    this.sharedService.setRegion(region);
                });
            }
            
            this.toraSubjectService.getAll(toraSubjectQuery, null).subscribe(toraSubjects => {
                this.toraSubjects = toraSubjects;
            });

            this.toraService.getToraObjectSummaries(toraObject.fkRegionId).subscribe(summary => {
                this.sharedService.setToraSummary(summary);
            });
        });


    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}