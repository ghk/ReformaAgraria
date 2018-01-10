import { Component, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';
import { RequestOptions } from "@angular/http/http";

import { AgrariaIssuesListService } from '../services/agrariaIssuesList';
import { CookieService } from 'ngx-cookie-service';
import { AlertService } from '../services/alert';
import { SharedService } from '../services/shared';
import { ToastrService } from 'ngx-toastr';
import { LandStatus } from '../models/gen/landStatus';
import { RegionalStatus } from '../models/gen/regionalStatus';
import { EducationalAttainment } from '../models/gen/educationalAttainment';
import { MaritalStatus } from '../models/gen/maritalStatus';
import { Gender } from '../models/gen/gender';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'ra-agraria-issues-list',
    templateUrl: '../templates/agrariaIssuesList.html',
})
export class AgrariaIssuesListComponent implements OnInit, OnDestroy {
    subscription: Subscription;

    LandStatus = LandStatus;
    EducationalAttainment = EducationalAttainment;
    MaritalStatus = MaritalStatus;
    Gender = Gender;
    RegionalStatus = RegionalStatus;

    objectList: any = [];
    subjectList: any = [];
    loading: boolean = false;
    showPage: boolean = true;
    loadingUploadModal: boolean = false;
    showUploadModal: boolean = true;
    orderBy: string = "region.name";
    isDesc: boolean = false;
    prevColumn: string = "";
    objectId: number = 0;

    region: any;

    constructor(
        private agrariaIssuesListService: AgrariaIssuesListService,
        private cookieService: CookieService,
        private alertService: AlertService,
        private sharedService: SharedService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.showPage = false;
        this.subscription = this.sharedService.getRegion().subscribe(region => {
            this.region = region;
            this.getObjectList(region.id);
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onToggle(id) {
        (<any>$("tr")).find('.collapse.show').collapse('hide');
        let img = $("#" + id + " img");
        if (img.hasClass("spin-icon")) {
            img.removeClass("spin-icon");
            img.addClass("back-spin");
        } else {
            img.removeClass("back-spin");
            img.addClass("spin-icon");
        }
    }

    uploadFile(event) {
        this.loadingUploadModal = true;
        this.showUploadModal = false;
        this.agrariaIssuesListService.import(event, this.region.id)
            .subscribe(
            data => {
                this.loadingUploadModal = false;
                this.showUploadModal = true;
                this.toastr.success('File is successfully uploaded', null)
                this.getObjectList(this.region.id);
            },
            error => {
                this.loadingUploadModal = false;
                this.showUploadModal = true;
                this.toastr.error('Unable to upload the file', null)
            });
    }

    getObjectList(id) {
        let query = { data: { 'type': 'getAllById', 'id': id } }
        this.agrariaIssuesListService.getAllObject(query, null).subscribe(data => {
            this.objectList = data;
            this.loading = false;
            this.showPage = true;
        });
    }

    getSubjectList(id) {
        let query = { data: { 'type': 'getAllById', 'id': id } }
        this.agrariaIssuesListService.getAllSubject(query, null).subscribe(data => this.subjectList = data);
    }

    delete(id) {
        this.objectId = id;
    }

    deleteObject() {
        this.agrariaIssuesListService.delete(this.objectId)
            .subscribe(
            data => {
                this.toastr.success('Data is successfully deleted.', null);
                this.getObjectList(this.region.id);
                (<any>$('#exampleModal1')).modal('hide');
            },
            error => {
                this.toastr.error(error, null);
            });
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