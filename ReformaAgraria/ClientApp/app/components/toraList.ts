import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';

import { ModalUploadToraDocumentComponent } from './modals/uploadToraDocument';
import { ModalToraObjectFormComponent } from './modals/toraObjectForm';

import { SharedService } from '../services/shared';
import { RegionService } from "../services/gen/region";
import { ToraObjectService } from '../services/gen/toraObject';
import { ToraSubjectService } from "../services/gen/toraSubject";
import { LandStatus } from '../models/gen/landStatus';
import { Status } from '../models/gen/status';
import { RegionalStatus } from '../models/gen/regionalStatus';
import { EducationalAttainment } from '../models/gen/educationalAttainment';
import { MaritalStatus } from '../models/gen/maritalStatus';
import { Gender } from '../models/gen/gender';
import { Query } from '../models/query';
import { ToraObject } from '../models/gen/toraObject';

import * as $ from 'jquery';

@Component({
    selector: 'ra-tora-list',
    templateUrl: '../templates/toraList.html',
})
export class ToraListComponent implements OnInit, OnDestroy {
    regionSubscription: Subscription;
    uploadSubscription: Subscription;
    toraObjectFormSubscription: Subscription;
    
    uploadModalRef: BsModalRef;
    toraObjectModalRef: BsModalRef;

    LandStatus = LandStatus;
    EducationalAttainment = EducationalAttainment;
    MaritalStatus = MaritalStatus;
    Gender = Gender;
    RegionalStatus = RegionalStatus;
    Status = Status;

    toraObjects: any = [];
    toraSubjects: any = [];
    loading: boolean = false;
    showPage: boolean = true;
    order: string = "region.name";
    orderBy: string = "region.name";
    isDesc: boolean = false;
    prevColumn: string = "";
    objectId: number = 0;
    model: any = [];
    subjectModel: any = [];
    desa: any = [];
    kecamatan: any = [];
    region: any;
    state: string;

    constructor(
        private toastr: ToastrService,
        private modalService: BsModalService,
        private sharedService: SharedService,
        private toraObjectService: ToraObjectService,        
        private regionService: RegionService,
        private toraSubjectService: ToraSubjectService        
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.showPage = false;
        this.regionSubscription = this.sharedService.getRegion().subscribe(region => {
            this.region = region;
            this.getToraObjects(region.id);
        });
    }

    ngOnDestroy(): void {
        this.regionSubscription.unsubscribe();
        if (this.uploadSubscription)
            this.uploadSubscription.unsubscribe();
        if (this.toraObjectFormSubscription)
            this.toraObjectFormSubscription.unsubscribe();
    }    

   
    getToraObjects(id): void {
        let query = { data: { 'type': 'getAllByRegion', 'regionId': id } }
        this.toraObjectService.getAll(query, null).subscribe(data => {
            this.toraObjects = data;
            this.loading = false;
            this.showPage = true;
        });
    }    

    onUploadDocument(): void {
        this.uploadModalRef = this.modalService.show(ModalUploadToraDocumentComponent);   
        if (!this.uploadSubscription)     
            this.uploadSubscription = this.uploadModalRef.content.isSaveSuccess$.subscribe(success => {
                if (success) {
                    this.getToraObjects(this.region.id);
                    this.uploadSubscription.unsubscribe();
                    this.uploadSubscription = null;
                    this.uploadModalRef.hide();
                }
            });
    }

    onShowToraObjectForm(toraObject: ToraObject): void {
        this.toraObjectModalRef = this.modalService.show(ModalToraObjectFormComponent, { class: 'modal-lg' });
        this.toraObjectModalRef.content.setToraObject(toraObject);
        if (!this.toraObjectFormSubscription)
            this.toraObjectFormSubscription = this.toraObjectModalRef.content.isSaveSuccess$.subscribe(success => {                
                if (success) {
                    this.getToraObjects(this.region.id);
                    this.toraObjectFormSubscription.unsubscribe();
                    this.toraObjectFormSubscription = null;  
                    this.toraObjectModalRef.hide();                  
                }
            }); 
    }     

    delete(id) {
        this.objectId = id;
    }

    deleteObject() {
        this.toraObjectService.deleteById(this.objectId)
            .subscribe(
            data => {
                this.toastr.success('Data berhasil dihapus', null);
                this.getToraObjects(this.region.id);
                (<any>$('#deleteModal')).modal('hide');
            },
            error => {
                this.toastr.error(error, null);
            });
    }

    sort(order: string) {
        if (this.order.includes(order)) {
            if (this.order.startsWith('-'))
                this.order = this.order.substr(1);
            else
                this.order = '-' + this.order;
        } else {
            this.order = order;
        }
    }

    convertRegionId(text) {
        return text.split('.').join('_');
    }    
}