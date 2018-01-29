import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';

import { ToraService } from '../services/tora';
import { SharedService } from '../services/shared';
import { ToraObjectService } from '../services/gen/toraObject';
import { ToraSubjectService } from "../services/gen/toraSubject";
import { RegionService } from "../services/gen/region";
import { LandStatus } from '../models/gen/landStatus';
import { Status } from '../models/gen/status';
import { RegionalStatus } from '../models/gen/regionalStatus';
import { EducationalAttainment } from '../models/gen/educationalAttainment';
import { MaritalStatus } from '../models/gen/maritalStatus';
import { Gender } from '../models/gen/gender';
import { Query } from '../models/query';

import * as $ from 'jquery';

import { ModalUploadToraDocumentComponent } from './modals/uploadToraDocument';
import { ModalToraObjectFormComponent } from './modals/toraObjectForm';
import { ToraObject } from '../models/gen/toraObject';

@Component({
    selector: 'ra-tora-list',
    templateUrl: '../templates/toraList.html',
})
export class ToraListComponent implements OnInit, OnDestroy {
    regionSubscription: Subscription;
    uploadSubscription: Subscription;
    toraFormSubscription: Subscription;
    
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
        private cookieService: CookieService,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private sharedService: SharedService,
        private toraService: ToraService,
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
        if (this.toraFormSubscription)
            this.toraFormSubscription.unsubscribe();
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
            this.uploadSubscription = this.uploadModalRef.content.isUploadSuccess$.subscribe(success => {
                if (success) {
                    this.getToraObjects(this.region.id);
                }
            });
    }

    onShowToraObjectForm(toraObject: ToraObject): void {
        this.toraObjectModalRef = this.modalService.show(ModalToraObjectFormComponent, { class: 'modal-lg' });
        this.toraObjectModalRef.content.setToraObject(toraObject);
    }

    addOrEditObject(model) {
        if (this.state == 'edit') {
            this.editObject(model);
        }
        else {
            this.addObject(model);
        }
    }

    addOrEditSubject(model) {
        if (this.state == 'edit') {
            this.editSubject(model);
        }
        else {
            //this.addSubject(model);
        }
    }

    add() {
        this.model = [];
        this.model.fkRegionId = this.region.id;
        this.state = 'add';
    }

    addObject(model) {
        this.toraObjectService.create(model).subscribe(
            data => {
                this.toastr.success("Penambahan Berhasil", null);
            },
            error => {
                this.toastr.error(error, null);
            }
        );
    }

    editObject(model) {
        this.toraObjectService.update(model).subscribe(
            data => {
                this.toastr.success("Pengeditan Berhasil", null);
            },
            error => {
                this.toastr.error(error, null);
            }
        );
    }

    editSubject(model) {
        this.subjectModel.name = model.name;
        this.subjectModel.maritalStatus = model.maritalStatus;
        this.subjectModel.address = model.address;
        this.subjectModel.gender = model.gender;
        this.subjectModel.age = model.age;
        this.subjectModel.educationalAttainment = model.educationalAttainment;
        this.subjectModel.totalFamilyMembers = model.totalFamilyMembers;
        this.subjectModel.landStatus = model.landStatus;
        this.subjectModel.landLocation = model.landLocation;
        this.subjectModel.size = model.size;
        this.subjectModel.plantTypes = model.plantTypes;
    }

    delete(id) {
        this.objectId = id;
    }

    deleteObject() {
        this.toraObjectService.deleteById(this.objectId)
            .subscribe(
            data => {
                this.toastr.success('Data is successfully deleted.', null);
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