import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { BsModalRef } from "ngx-bootstrap";
import { Progress } from "angular-progress-http";
import { ToastrService } from "ngx-toastr";

import { EducationalAttainment } from '../../models/gen/educationalAttainment';
import { MaritalStatus } from '../../models/gen/maritalStatus';
import { Gender } from '../../models/gen/gender';

import { Query } from "../../models/query";
import { Region } from "../../models/gen/region";
import { ToraSubject } from "../../models/gen/toraSubject";
import { SharedService } from "../../services/shared";
import { RegionService } from "../../services/gen/region";
import { ToraSubjectService } from "../../services/gen/toraSubject";


@Component({
    selector: 'modal-tora-subject-form',
    templateUrl: '../../templates/modals/toraSubjectForm.html',
})
export class ModalToraObjectFormComponent implements OnInit, OnDestroy {   
    progress: Progress;
    subscription: Subscription;    
    
    EducationalAttainment = EducationalAttainment;
    MaritalStatus = MaritalStatus;
    Gender = Gender;
    
    toraSubject: ToraSubject;
    kecamatan: Region;
    kabupaten: Region;
    desa: Region;  

    constructor(
        public bsModalRef: BsModalRef,
        private toastr: ToastrService,
        private sharedService: SharedService,
        private regionService: RegionService,
        private toraSubjectService: ToraSubjectService,
    ) { }

    ngOnInit(): void {
        this.toraSubject = {};        
    }

    ngOnDestroy(): void {        
        this.subscription.unsubscribe();
    }  
   
    setToraSubject(toraSubject: ToraSubject): void {
        if (toraSubject) {
            this.toraSubject = toraSubject;
        }
    } 

    onFormSubmit(): void {
        this.toraSubjectService.createOrUpdate(this.toraSubject, null).subscribe(
            success => {
                this.toastr.success("Subjek TORA berhasil disimpan");
                this.bsModalRef.hide();
            },
            error => {
                this.toastr.error("Ada kesalahan dalam penyimpanan");
                this.bsModalRef.hide();
            }
        );
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}