import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Progress } from "angular-progress-http";

import { SharedService } from '../services/shared';
import { RegionService } from '../services/gen/region';
import { ToraService } from '../services/tora';
import { ToraObjectService } from '../services/gen/toraObject';
import { ToraSubjectService } from '../services/gen/toraSubject';

import { Region } from '../models/gen/region';
import { ToraObject } from '../models/gen/toraObject';
import { ToraSubject } from '../models/gen/toraSubject';
import { Query } from '../models/query';
import { RegionalStatus } from '../models/gen/regionalStatus';
import { LandStatus } from '../models/gen/landStatus';
import { EducationalAttainment } from '../models/gen/educationalAttainment';
import { MaritalStatus } from '../models/gen/maritalStatus';
import { Gender } from '../models/gen/gender';
import { Status } from '../models/gen/status';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { ModalToraObjectFormComponent } from './modals/toraObjectForm';
import { ModalToraSubjectFormComponent } from './modals/toraSubjectForm';

@Component({
    selector: 'ra-tora-detail',
    templateUrl: '../templates/toraDetail.html',
})
export class ToraDetailComponent implements OnInit, OnDestroy {       
    toraObjectModalRef: BsModalRef;
    toraSubjectModalRef: BsModalRef;
    routeSubscription: Subscription; 
    toraObjectFormSubscription: Subscription;
    toraSubjectFormSubscription: Subscription;
    
    RegionalStatus = RegionalStatus;   
    LandStatus = LandStatus;
    EducationalAttainment = EducationalAttainment;
    MaritalStatus = MaritalStatus;
    Gender = Gender;
    Status = Status;
    
    toraObjectId: number;
    toraObject: ToraObject;
    toraSubjects: ToraSubject[];
    progress: Progress;

    constructor(
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private sharedService: SharedService,
        private regionService: RegionService,
        private toraService: ToraService,
        private toraObjectService: ToraObjectService,
        private toraSubjectService: ToraSubjectService
    ) { }

    ngOnInit(): void {
        this.routeSubscription = this.route.params.subscribe(params => {
            this.toraObjectId = +params['id'];            
            this.getData(this.toraObjectId);            
        });
    }
    
    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
        if (this.toraObjectFormSubscription)
            this.toraObjectFormSubscription.unsubscribe();
        if (this.toraSubjectFormSubscription)
            this.toraSubjectFormSubscription.unsubscribe();
    }

    getData(toraObjectId: number): void {        
        let toraObjectQuery: Query = {
            data: {
                type: 'getCompleteRegion'
            }
        };

        let toraSubjectQuery: Query = {
            data: {
                type: 'getAllByToraObject',
                toraObjectId: toraObjectId
            }
        };

        this.toraObjectService.getById(toraObjectId, toraObjectQuery, null).subscribe(toraObject => {
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

            this.toraService.getSummaries(toraObject.fkRegionId).subscribe(summary => {
                this.sharedService.setToraSummary(summary);
            });
        });
    }

    onShowToraObjectForm(): void {
        this.toraObjectModalRef = this.modalService.show(ModalToraObjectFormComponent, { 'class': 'modal-lg' });
        this.toraObjectModalRef.content.setToraObject(this.toraObject);
        if (!this.toraObjectFormSubscription)
            this.toraObjectFormSubscription = this.toraObjectModalRef.content.isSaveSuccess$.subscribe(success => {                
                if (success) {
                    this.getData(this.toraObject.id);
                    this.toraObjectFormSubscription.unsubscribe();
                    this.toraObjectFormSubscription = null;  
                    this.toraObjectModalRef.hide();                  
                }
            });        
    }    

    onShowToraSubjectForm(toraSubject: ToraSubject): void {
        this.toraSubjectModalRef = this.modalService.show(ModalToraSubjectFormComponent, { 'class': 'modal-lg' });
        this.toraSubjectModalRef.content.setToraObject(this.toraObject);        
        this.toraSubjectModalRef.content.setToraSubject(toraSubject);        
        if (!this.toraSubjectFormSubscription)
            this.toraSubjectFormSubscription = this.toraSubjectModalRef.content.isSaveSuccess$.subscribe(success => {
                if (success) {
                    this.getData(this.toraObject.id);
                    this.toraSubjectFormSubscription.unsubscribe();
                    this.toraSubjectFormSubscription = null;
                    this.toraSubjectModalRef.hide();
                }
            });
    }
    
    progressListener(progress: Progress) {
        this.progress = progress;
    }

}