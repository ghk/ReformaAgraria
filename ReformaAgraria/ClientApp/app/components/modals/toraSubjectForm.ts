import { Component, OnInit, OnDestroy } from "@angular/core";
import { ReplaySubject, Subscription } from "rxjs";
import { BsModalRef } from "ngx-bootstrap";
import { Progress } from "angular-progress-http";
import { ToastrService } from "ngx-toastr";

import { EducationalAttainment } from '../../models/gen/educationalAttainment';
import { MaritalStatus } from '../../models/gen/maritalStatus';
import { Gender } from '../../models/gen/gender';
import { LandStatus } from '../../models/gen/landStatus';

import { Query } from "../../models/query";
import { ToraObject } from "../../models/gen/toraObject";
import { ToraSubject } from "../../models/gen/toraSubject";
import { ToraSubjectService } from "../../services/gen/toraSubject";


@Component({
    selector: 'modal-tora-subject-form',
    templateUrl: '../../templates/modals/toraSubjectForm.html',
})
export class ModalToraSubjectFormComponent implements OnInit, OnDestroy {   
    progress: Progress;
    
    EducationalAttainment = EducationalAttainment;
    MaritalStatus = MaritalStatus;
    Gender = Gender;
    LandStatus = LandStatus;
    
    toraObject: ToraObject;
    toraSubject: ToraSubject;

    private isSaveSuccess$: ReplaySubject<boolean> = new ReplaySubject(1);   

    constructor(
        public bsModalRef: BsModalRef,
        private toastr: ToastrService,
        private toraSubjectService: ToraSubjectService,
    ) { }

    ngOnInit(): void {
        this.toraSubject = {};        
    }

    ngOnDestroy(): void {        
    }  
   
    setToraSubject(toraSubject: ToraSubject): void {
        if (toraSubject) {
            this.toraSubject = JSON.parse(JSON.stringify(toraSubject));
        }
    } 

    setToraObject(toraObject: ToraObject): void {        
        this.toraSubject.fkToraObjectId = toraObject.id;        
    }

    onFormSubmit(): void {        
        this.toraSubjectService.createOrUpdate(this.toraSubject, null).subscribe(
            success => {
                this.toastr.success("Subjek TORA berhasil disimpan");
                this.isSaveSuccess$.next(true);
            },
            error => {
                this.toastr.error("Ada kesalahan dalam penyimpanan");
                this.isSaveSuccess$.next(false);
            }
        );
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}