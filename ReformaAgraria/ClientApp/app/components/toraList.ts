import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ToraService } from '../services/tora';
import { SharedService } from '../services/shared';
import { LandStatus } from '../models/gen/landStatus';
import { Status } from '../models/gen/status';
import { RegionalStatus } from '../models/gen/regionalStatus';
import { EducationalAttainment } from '../models/gen/educationalAttainment';
import { MaritalStatus } from '../models/gen/maritalStatus';
import { Gender } from '../models/gen/gender';
import { Query } from '../models/query';
import * as $ from 'jquery';
import { ToraObjectService } from '../services/gen/toraObject';
import { RegionService } from "../services/gen/region";
import { ToraSubjectService } from "../services/gen/toraSubject";

@Component({
    selector: 'ra-tora-list',
    templateUrl: '../templates/toraList.html',
})
export class ToraListComponent implements OnInit, OnDestroy {
    subscription: Subscription;

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
    loadingUploadModal: boolean = false;
    showUploadModal: boolean = true;
    order: string = "region.name";
    orderBy: string = "region.name";
    isDesc: boolean = false;
    prevColumn: string = "";
    objectId: number = 0;
    model: any = [];
    desa: any = [];
    kecamatan: any = [];
    region: any;
    state: string;

    constructor(
        private cookieService: CookieService,
        private toastr: ToastrService,
        private toraService: ToraService,
        private toraObjectService: ToraObjectService,
        private sharedService: SharedService,
        private regionService: RegionService,
        private toraSubjectService: ToraSubjectService
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.showPage = false;
        this.subscription = this.sharedService.getRegion().subscribe(region => {
            this.region = region;
            this.getToraObjects(region.id);
            //this.getDesa(region.fkParentId);
            //this.getKecamatan('72.1');
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    uploadFile(event) {
        this.loadingUploadModal = true;
        this.showUploadModal = false;
        this.toraService.importToraObject(event, this.region.id)
            .subscribe(
            data => {
                this.loadingUploadModal = false;
                this.showUploadModal = true;
                this.toastr.success('File is successfully uploaded', null)
                this.getToraObjects(this.region.id);
            },
            error => {
                this.loadingUploadModal = false;
                this.showUploadModal = true;
                this.toastr.error('Unable to upload the file', null)
            });
    }

    getKecamatan(parentId: string) {
        let query = { data: { 'type': 'parent', 'regionType': 3, 'parentId': parentId } }
        this.regionService.getAll(query, null).subscribe(data => {
            this.kecamatan = data;
        });
    }

    getDesa(parentId: string) {
        let query = { data: { 'type': 'parent', 'regionType': 4, 'parentId': parentId } }
        this.regionService.getAll(query, null).subscribe(data => {
            this.desa = data;
        });
    }

    getToraObjects(id) {
        let query = { data: { 'type': 'getAllByRegion', 'regionId': id } }
        this.toraObjectService.getAll(query, null).subscribe(data => {
            this.toraObjects = data;
            this.loading = false;
            this.showPage = true;
        });
    }

    getToraSubjects(id) {
        console.log(id);
        let toraSubjectQuery: Query = {
            data: {
                type: 'getAllByToraObjectId',
                toraObjectId: id
            }
        };
        this.toraSubjectService.getAll(toraSubjectQuery, null).subscribe(toraSubjects => {
            this.toraSubjects = toraSubjects;
        });
    }

    addOrEditObject(model) {
        if (this.state == 'edit') {
            this.editObject(model);
        }
        else {
            this.addObject(model);
        }
    }

    add() {
        this.model = [];
        this.model.fkRegionId = this.region.id;
        this.state = 'add';
    }

    addObject(model) {
        this.toraService.addToraObject(model).subscribe(
            data => {
            this.toastr.success("Penambahan Berhasil", null);
            },
            error => {
                this.toastr.error(error, null);
            });
    }

    edit(object) {
        this.model = object;
        this.state = 'edit';
        this.getToraSubjects(this.model.id);
    }

    editObject(model) {
        this.toraService.editToraObject(model).subscribe(
            data => {
            this.toastr.success("Pengeditan Berhasil", null);
            },
            error => {
                this.toastr.error(error, null);
            });
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

    sorted(sortedBy: string) {
        if (sortedBy == "Penggarap") {
            this.orderBy = 'totalToraObjects';
        }
        else if (sortedBy == "Status") {
            this.orderBy = 'landStatus';
        }
        else if (sortedBy == "Usulan") {
            this.orderBy = 'proposedTreatment';
        }
        else if (sortedBy == "Koordinat") {
            this.orderBy = '';
        }
        else if (sortedBy == "Tahapan") {
            this.orderBy = '';
        }
        else {
            this.orderBy = 'name';
        }

        if (this.prevColumn != this.orderBy) {
            this.isDesc = false;
        }
        else {
            if (this.isDesc == false) {
                this.isDesc = true;
            }
            else {
                this.isDesc = false;
            }
        }

        this.prevColumn = this.orderBy;
    }
}