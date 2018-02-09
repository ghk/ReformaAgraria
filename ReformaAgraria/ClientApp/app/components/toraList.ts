import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';

import { ModalDeleteComponent } from './modals/delete';
import { ModalUploadToraDocumentComponent } from './modals/uploadToraDocument';
import { ModalToraObjectFormComponent } from './modals/toraObjectForm';

import { SharedService } from '../services/shared';
import { ToraObjectService } from '../services/gen/toraObject';

import { LandStatus } from '../models/gen/landStatus';
import { Status } from '../models/gen/status';
import { RegionalStatus } from '../models/gen/regionalStatus';
import { EducationalAttainment } from '../models/gen/educationalAttainment';
import { MaritalStatus } from '../models/gen/maritalStatus';
import { Gender } from '../models/gen/gender';
import { Query } from '../models/query';
import { ToraObject } from '../models/gen/toraObject';


@Component({
    selector: 'ra-tora-list',
    templateUrl: '../templates/toraList.html',
})
export class ToraListComponent implements OnInit, OnDestroy {
    regionSubscription: Subscription;
    uploadSubscription: Subscription;
    deleteSubscription: Subscription;
    toraObjectFormSubscription: Subscription;

    uploadModalRef: BsModalRef;
    deleteModalRef: BsModalRef;
    toraObjectModalRef: BsModalRef;

    LandStatus = LandStatus;
    EducationalAttainment = EducationalAttainment;
    MaritalStatus = MaritalStatus;
    Gender = Gender;
    RegionalStatus = RegionalStatus;
    Status = Status;

    loading: boolean = false;
    order: string = "region.name";
    isDesc: boolean = false;

    region: any;
    toraObjects: any = [];

    constructor(
        private toastr: ToastrService,
        private modalService: BsModalService,
        private sharedService: SharedService,
        private toraObjectService: ToraObjectService,
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.regionSubscription = this.sharedService.getRegion().subscribe(region => {
            this.region = region;
            this.getToraObjects(region.id);
        });
    }

    ngOnDestroy(): void {
        this.regionSubscription.unsubscribe();
        if (this.uploadSubscription)
            this.uploadSubscription.unsubscribe();
        if (this.deleteSubscription)
            this.deleteSubscription.unsubscribe();
        if (this.toraObjectFormSubscription)
            this.toraObjectFormSubscription.unsubscribe();            
    }


    getToraObjects(id): void {
        let query = { data: { 'type': 'getAllByRegion', 'regionId': id } }
        this.toraObjectService.getAll(query, null).subscribe(data => {
            this.toraObjects = data;
            this.loading = false;
        });
    }

    onUploadDocument(): void {
        this.uploadModalRef = this.modalService.show(ModalUploadToraDocumentComponent);
        if (!this.uploadSubscription)
            this.uploadSubscription = this.uploadModalRef.content.isSaveSuccess$.subscribe(error => {
                if (!error) {
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
            this.toraObjectFormSubscription = this.toraObjectModalRef.content.isSaveSuccess$.subscribe(error => {
                if (!error) {
                    this.getToraObjects(this.region.id);
                    this.toraObjectFormSubscription.unsubscribe();
                    this.toraObjectFormSubscription = null;
                    this.toraObjectModalRef.hide();
                }
            });
    }

    onDeleteToraObject(toraObject: ToraObject): void {
        this.deleteModalRef = this.modalService.show(ModalDeleteComponent);
        this.deleteModalRef.content.setModel(toraObject);
        this.deleteModalRef.content.setService(this.toraObjectService);
        this.deleteModalRef.content.setLabel(toraObject.name);
        if (!this.deleteSubscription)
            this.deleteSubscription = this.deleteModalRef.content.isDeleteSuccess$.subscribe(error => {
                if (!error) {
                    this.getToraObjects(this.region.id);
                    this.deleteSubscription.unsubscribe();
                    this.deleteSubscription = null;
                    this.deleteModalRef.hide();
                }
            })
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