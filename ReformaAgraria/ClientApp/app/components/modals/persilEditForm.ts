import { Component, OnInit, OnDestroy } from "@angular/core";
import { ReplaySubject, Subscription } from "rxjs";
import { BsModalRef } from "ngx-bootstrap";
import { Progress } from "angular-progress-http";
import { ToastrService } from "ngx-toastr";

import { Status } from '../../models/gen/status';
import { Persil } from '../../models/gen/persil';
import { RegionalStatus } from '../../models/gen/regionalStatus';
import { LandStatus } from '../../models/gen/landStatus';
import { EducationalAttainment } from '../../models/gen/educationalAttainment';
import { MaritalStatus } from '../../models/gen/maritalStatus';
import { Gender } from '../../models/gen/gender';
import { Query } from "../../models/query";
import { ToraObject } from "../../models/gen/toraObject";
import { ToraSubject } from "../../models/gen/toraSubject";
import { EditPersilViewModel } from '../../models/gen/editPersilViewModel';

import { SchemeService } from "../../services/gen/scheme";
import { PersilService } from "../../services/gen/persil";
import { ToraSubjectService } from "../../services/gen/toraSubject";
import { SharedService } from "../../services/shared";

import * as $ from 'jquery';


@Component({
    selector: 'modal-persil-edit-form',
    templateUrl: '../../templates/modals/persilEditForm.html',
})
export class ModalPersilEditFormComponent implements OnInit, OnDestroy {
    progress: Progress;

    RegionalStatus = RegionalStatus;
    LandStatus = LandStatus;
    EducationalAttainment = EducationalAttainment;
    MaritalStatus = MaritalStatus;
    Gender = Gender;
    Status = Status;

    persil: Persil = {};
    schemes = [{}];
    region: any;
    toraSubjects: ToraSubject[] = [];
    persilSubjects: ToraSubject[];
    addedSubjects: ToraSubject[] = [];
    removedSubjects: ToraSubject[] = [];
    model: EditPersilViewModel = {};

    subscription: Subscription;

    

    private isSaveSuccess$: ReplaySubject<any> = new ReplaySubject(1);

    constructor(
        public bsModalRef: BsModalRef,
        private toastr: ToastrService,
        private schemeService: SchemeService,
        private persilService: PersilService,
        private sharedService: SharedService,
        private toraSubjectService: ToraSubjectService
    ) { }

    ngOnInit(): void {
        this.subscription = this.sharedService.getRegion().subscribe(region => {
            this.region = region;
            this.getScheme();
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    setPersil(persil: Persil): void {
        if (persil) {
            this.persil = JSON.parse(JSON.stringify(persil));
            if (this.persil.totalSize == null) {
                this.persil.totalSize = 0.00;
            }
            if (this.persil.totalSubject == null) {
                this.persil.totalSubject = 0;
            }
        }
    }

    addSubject(toraSubject: ToraSubject, i, status) {
        if (status == 'initial') {
            toraSubject.fkPersilId = this.persil.id;
            this.addedSubjects.push(toraSubject);
            this.toraSubjects.splice(i, 1);
            this.persil.totalSize += toraSubject.size;
            this.persil.totalSubject += 1;
        }
        else {
            toraSubject.fkPersilId = this.persil.id;
            this.persilSubjects.push(toraSubject);
            this.removedSubjects.splice(i, 1);
            this.persil.totalSize += toraSubject.size;
            this.persil.totalSubject += 1;
        }
    }

    removeSubject(toraSubject: ToraSubject, i, status) {
        if (status == 'added') {
            this.addedSubjects.splice(i, 1);
            this.toraSubjects.push(toraSubject);
            this.persil.totalSize -= toraSubject.size;
            this.persil.totalSubject -= 1;
        }
        else {
            toraSubject.fkPersilId = null;
            this.persilSubjects.splice(i, 1);
            this.removedSubjects.push(toraSubject);
            this.persil.totalSize -= toraSubject.size;
            this.persil.totalSubject -= 1;
        }
        
    }

    setToraSubject(toraSubjects: ToraSubject[]): void {
        if (toraSubjects) {
            var raw = JSON.parse(JSON.stringify(toraSubjects));
            for (var i = 0; i < raw.length; i++) {
                if (raw[i].fkPersilId == null || raw[i].fkPersilId == 0) {
                    this.toraSubjects.push(raw[i]);
                }
            }
        }
    }

    setPersilSubjects(persilId): void {
        if (persilId) {
            let persilQuery: Query = {
                data: {
                    type: 'getAllByPersil',
                    persilId: this.persil.id
                }
            };

            this.toraSubjectService.getAll(persilQuery, null).subscribe(toraSubjects => {
                this.persilSubjects = toraSubjects;
            });
        }
    }

    onFormSubmit(): void {
        let formData = new FormData();
        formData.append('persilId', this.persil.id.toString());
        formData.append('persilStatus', this.persil.status.toString());
        formData.append('persilTotalSubject', this.persil.totalSubject.toString());
        formData.append('persilTotalSize', this.persil.totalSize.toString());
        formData.append('file', this.model.file);

        if (this.addedSubjects.length > 0) {
            for (var i = 0; i < this.addedSubjects.length; i++) {
                this.toraSubjectService.createOrUpdate(this.addedSubjects[i], null).subscribe(
                    success => {
                    },
                    error => {
                    });
            }
        }
        if (this.removedSubjects.length > 0) {
            for (var i = 0; i < this.removedSubjects.length; i++) {
                this.toraSubjectService.createOrUpdate(this.removedSubjects[i], null).subscribe(
                    success => {
                    },
                    error => {
                    });
            }
        }

        this.persilService.upload(formData).subscribe(
            data => {
                this.toastr.success('Persil berhasil disimpan', null);
                this.isSaveSuccess$.next(null);
            },
            error => {
                this.toastr.error('Ada kesalahan dalam upload', null);
                this.isSaveSuccess$.next(error);
            }
        );
    }

    onSelectFile(file: File) {
        this.model.file = file;
    }

    getScheme() {
        this.schemeService.getAll().subscribe(scheme => {
            this.schemes = scheme;
        })
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}