import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ToraService } from '../services/tora';
import { SharedService } from '../services/shared';
import { LandStatus } from '../models/gen/landStatus';
import { RegionalStatus } from '../models/gen/regionalStatus';
import { EducationalAttainment } from '../models/gen/educationalAttainment';
import { MaritalStatus } from '../models/gen/maritalStatus';
import { Gender } from '../models/gen/gender';
import * as $ from 'jquery';
import { ToraObjectService } from '../services/gen/toraObject';

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

    region: any;

    constructor(        
        private cookieService: CookieService,        
        private toastr: ToastrService,
        private toraService: ToraService,
        private toraObjectService: ToraObjectService,
        private sharedService: SharedService
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.showPage = false;
        this.subscription = this.sharedService.getRegion().subscribe(region => {
            this.region = region;
            this.getToraObjects(region.id);
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

    getToraObjects(id) {
        let query = { data: { 'type': 'getAllByRegion', 'regionId': id } }
        this.toraObjectService.getAll(query, null).subscribe(data => {
            this.toraObjects = data;
            this.loading = false;
            this.showPage = true;
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