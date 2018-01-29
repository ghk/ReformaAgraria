import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { BehaviorSubject, ReplaySubject, Subscription } from "rxjs";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Progress } from "angular-progress-http";
import { ToastrService } from "ngx-toastr";

import { LandStatus } from '../../models/gen/landStatus';
import { Status } from '../../models/gen/status';
import { RegionalStatus } from '../../models/gen/regionalStatus';
import { EducationalAttainment } from '../../models/gen/educationalAttainment';
import { MaritalStatus } from '../../models/gen/maritalStatus';
import { Gender } from '../../models/gen/gender';

import { Query } from "../../models/query";
import { Region } from "../../models/gen/region";
import { ToraObject } from "../../models/gen/toraObject";
import { ToraService } from "../../services/tora";
import { SharedService } from "../../services/shared";
import { RegionService } from "../../services/gen/region";
import { RegionType } from "../../models/gen/regionType";
import { ToraSubject } from "../../models/gen/toraSubject";
import { ToraSubjectService } from "../../services/gen/toraSubject";
import { ModalDeleteComponent } from "./delete";

@Component({
    selector: 'modal-tora-form',
    templateUrl: '../../templates/modals/toraForm.html',
})
export class ModalToraFormComponent implements OnInit, OnDestroy {   
    subscription: Subscription;    
    
    LandStatus = LandStatus;
    EducationalAttainment = EducationalAttainment;
    MaritalStatus = MaritalStatus;
    Gender = Gender;
    RegionalStatus = RegionalStatus;
    Status = Status;
    
    toraObject: ToraObject;
    toraSubject: ToraSubject;
    toraSubjects: ToraSubject[];
    kecamatan: Region;
    kabupaten: Region;
    desa: Region;  
    
    deleteModalRef: BsModalRef;
    progress: Progress;

    constructor(
        public bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private sharedService: SharedService,
        private regionService: RegionService,
        private toraService: ToraService,
        private toraSubjectService: ToraSubjectService
    ) { }

    ngOnInit(): void {
        this.toraObject = {};
        this.toraSubject = {};
        this.subscription = this.sharedService.getRegion().subscribe(region => {       
            this.getRegion(region);
        });
    }

    ngOnDestroy(): void {        
        this.subscription.unsubscribe();
    }  
   
    setToraObject(toraObject: ToraObject): void {
        if (!toraObject) {
            this.toraObject = {};
            this.toraSubjects = [];
        }
        else {
            this.toraObject = toraObject;
            this.getToraSubjects(toraObject);
        }
    }

    getRegion(region: Region): void {
        let depthQuery = { 
            data: {
                'type': 'getByDepth',
                'depth': 2
            }
        };
                    
        this.regionService.getById(region.id, depthQuery, null).subscribe(region => {
            this.desa = region;
            this.kecamatan = region.parent;
            this.kabupaten = region.parent.parent;
        });
    }

    getToraSubjects(toraObject: ToraObject): void {        
        let toraSubjectsQuery: Query = {
            data: {
                'type': 'getAllByToraObject',
                'toraObjectId': toraObject.id
            }
        }

        this.toraSubjectService.getAll(toraSubjectsQuery, null).subscribe(results => {
            this.toraSubjects = results;
        });
    }

    onToraSubjectSelected(toraSubject: ToraSubject): void {
        this.toraSubject = toraSubject;
    }

    onToraSubjectDeleted(toraSubject: ToraSubject): void {
        this.deleteModalRef = this.modalService.show(ModalDeleteComponent);
        this.deleteModalRef.content.setModel(toraSubject);
        this.deleteModalRef.content.setService(this.toraSubjectService);
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}