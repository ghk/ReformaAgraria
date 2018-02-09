import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Progress } from "angular-progress-http";
import { saveAs } from 'file-saver';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { ToastrService } from 'ngx-toastr';

import { ModalToraObjectFormComponent } from './modals/toraObjectForm';
import { ModalToraSubjectFormComponent } from './modals/toraSubjectForm';
import { ModalDeleteComponent } from './modals/delete';

import { SharedService } from '../services/shared';
import { RegionService } from '../services/gen/region';
import { ToraObjectService } from '../services/gen/toraObject';
import { ToraSubjectService } from '../services/gen/toraSubject';
import { ToraMapService } from '../services/gen/toraMap';

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

@Component({
    selector: 'ra-tora-detail',
    templateUrl: '../templates/toraDetail.html',
})
export class ToraDetailComponent implements OnInit, OnDestroy {
    toraObjectModalRef: BsModalRef;
    toraSubjectModalRef: BsModalRef;
    deleteModalRef: BsModalRef;

    routeSubscription: Subscription;
    toraObjectFormSubscription: Subscription;
    toraSubjectFormSubscription: Subscription;
    deleteSubscription: Subscription;

    RegionalStatus = RegionalStatus;
    LandStatus = LandStatus;
    EducationalAttainment = EducationalAttainment;
    MaritalStatus = MaritalStatus;
    Gender = Gender;
    Status = Status;
    subscription: Subscription;
    
    toraObjectId: number;
    toraObject: ToraObject;
    toraSubjects: ToraSubject[];
    progress: Progress;

    constructor(
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private sharedService: SharedService,
        private regionService: RegionService,
        private toraObjectService: ToraObjectService,
        private toraSubjectService: ToraSubjectService,
        private toraMapService: ToraMapService
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
        if (this.deleteSubscription)
            this.deleteSubscription.unsubscribe();
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

            this.toraObjectService.getSummary(toraObject.fkRegionId).subscribe(summary => {
                this.sharedService.setToraSummary(summary);
            });
        });
    }

    onExport() {
        this.toraObjectService.download(this.toraObject.id).subscribe(data => {
            let blob = new Blob([data.blob()], { type: 'application/xlsx' });
            saveAs(blob, 'tora.xlsx');
        });
    }

    onShowToraObjectForm(): void {
        this.toraObjectModalRef = this.modalService.show(ModalToraObjectFormComponent, { 'class': 'modal-lg' });
        this.toraObjectModalRef.content.setToraObject(this.toraObject);
        if (!this.toraObjectFormSubscription)
            this.toraObjectFormSubscription = this.toraObjectModalRef.content.isSaveSuccess$.subscribe(error => {
                if (!error) {
                    this.getData(this.toraObject.id);
                    this.toraObjectFormSubscription.unsubscribe();
                    this.toraObjectFormSubscription = null;
                    this.toraObjectModalRef.hide();
                }
            });
    }

    onToraMapUpload() {
        $('#toraMapUploader').click();
    }

    onToraMapUploaderChanged(file: File) {
        let formData = new FormData();
        formData.append("toraObjectId", this.toraObject.id.toString());
        formData.append("toraObjectName", this.toraObject.name);
        formData.append("regionId", this.toraObject.fkRegionId);
        formData.append("file", file);

        this.toraMapService.upload(formData).subscribe(
            data => {
                this.toastr.success("Upload File Berhasil", null);
                this.sharedService.setToraMapReloadedStatus(true);
            },
            error => {
                this.toastr.error("Ada kesalahan dalam upload", null);
            }
        );
    }

    onToraMapDownload(toraObject: ToraObject) {
        this.toraMapService.downloadByToraObject(toraObject.id).subscribe(data => {
            let blob = new Blob([data.blob()], { type: 'application/zip' });
            saveAs(blob, name + '.zip');
        })
    }

    onShowToraSubjectForm(toraSubject: ToraSubject): void {
        this.toraSubjectModalRef = this.modalService.show(ModalToraSubjectFormComponent, { 'class': 'modal-lg' });
        this.toraSubjectModalRef.content.setToraObject(this.toraObject);
        this.toraSubjectModalRef.content.setToraSubject(toraSubject);
        if (!this.toraSubjectFormSubscription)
            this.toraSubjectFormSubscription = this.toraSubjectModalRef.content.isSaveSuccess$.subscribe(error => {
                if (!error) {
                    this.getData(this.toraObject.id);
                    this.toraSubjectFormSubscription.unsubscribe();
                    this.toraSubjectFormSubscription = null;
                    this.toraSubjectModalRef.hide();
                }
            });
    }

    onDeleteToraSubject(toraSubject: ToraSubject): void {
        this.deleteModalRef = this.modalService.show(ModalDeleteComponent);
        this.deleteModalRef.content.setModel(toraSubject);
        this.deleteModalRef.content.setService(this.toraSubjectService);
        this.deleteModalRef.content.setLabel(toraSubject.name);
        if (!this.deleteSubscription)
            this.deleteSubscription = this.deleteModalRef.content.isDeleteSuccess$.subscribe(error => {
                if (!error) {
                    this.getData(this.toraObject.id);
                    this.deleteSubscription.unsubscribe();
                    this.deleteSubscription = null;
                    this.deleteModalRef.hide();
                }
            })
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }

}