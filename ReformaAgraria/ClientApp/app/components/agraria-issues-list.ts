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

@Component({
    selector: 'ra-agraria-issues-list',
    templateUrl: '../templates/agraria-issues-list.html',
})
export class AgrariaIssuesListComponent implements OnInit, OnDestroy {
    objectList: any = [];
    subjectList: any = [];
    LandStatus = LandStatus;
    EducationalAttainment = EducationalAttainment;
    MaritalStatus = MaritalStatus;
    Gender = Gender;
    RegionalStatus = RegionalStatus;
    regionId = this.cookieService.get('regionId');
    reloaded: boolean = false;
    loading: boolean = false;
    showPage: boolean = true;
    loadingUploadModal: boolean = false;
    showUploadModal: boolean = true;

    constructor(
        private agrariaIssuesList: AgrariaIssuesListService,
        private cookieService: CookieService,
        private alertService: AlertService,
        private sharedService: SharedService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.showPage = false;
        this.sharedService.getIsAgrariaIssuesListReloaded().subscribe(reloaded => {
            this.reloaded = reloaded;
            this.sharedService.getRegionId().subscribe(id => {
                this.getObjectList(id);
            });
        });
    }

    ngOnDestroy(): void {

    }

     onToggle(id, objectId){
         this.getSubjectList(objectId);
         let img = $("#" + id + " img");
         if(img.hasClass("spin-icon")){
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
        this.agrariaIssuesList.import(event, this.regionId)
            .subscribe(
            data => {
                this.loadingUploadModal = false;
                this.showUploadModal = true;
                this.toastr.success('File is successfully uploaded', null)
            },
            error => {
                this.loadingUploadModal = false;
                this.showUploadModal = true;
                this.toastr.error(error, null)
            });
    }

    getObjectList(id) {
        let query = { data: { 'type': 'getAllById', 'id': id } }
        this.agrariaIssuesList.getAllObject(query, null).subscribe(data => {
            this.objectList = data;
            this.loading = false;
            this.showPage = true;
        });
    }

    getSubjectList(id) {
        let query = { data: { 'type': 'getAllById', 'id': id } }
        this.agrariaIssuesList.getAllSubject(query, null).subscribe(data => this.subjectList = data);
    }

    deleteObject(id) {
        this.agrariaIssuesList.deleteObject(id)
            .subscribe(
            data => {
                this.toastr.success('Data is successfully deleted.', null);
                this.getObjectList(this.regionId);
                (<any>$('#modalDelete')).modal('hide');
            },
            error => {
                this.toastr.error(error, null);
            });
    }


}