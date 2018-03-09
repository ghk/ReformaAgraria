import { Component, OnInit, OnDestroy } from "@angular/core";
import { ReplaySubject, Subscription } from "rxjs";
import { BsModalRef } from "ngx-bootstrap";
import { Progress } from "angular-progress-http";
import { ToastrService } from "ngx-toastr";

import { Status } from '../../models/gen/status';
import { Persil } from '../../models/gen/persil';

import { Query } from "../../models/query";
import { ToraObject } from "../../models/gen/toraObject";
import { ToraSubject } from "../../models/gen/toraSubject";
import { SchemeService } from "../../services/gen/scheme";
import { PersilService } from "../../services/gen/persil";
import { SharedService } from "../../services/shared";


@Component({
    selector: 'modal-persil-form',
    templateUrl: '../../templates/modals/persilForm.html',
})
export class ModalPersilFormComponent implements OnInit, OnDestroy {
    progress: Progress;

    Status = Status;
    persil: Persil = {};
    schemes = [{}];
    region: any;
    toraSubjects: ToraSubject[];

    subscription: Subscription;

    private isSaveSuccess$: ReplaySubject<any> = new ReplaySubject(1);

    constructor(
        public bsModalRef: BsModalRef,
        private toastr: ToastrService,
        private schemeService: SchemeService,
        private persilService: PersilService,
        private sharedService: SharedService
    ) { }

    ngOnInit(): void {
        this.subscription = this.sharedService.getRegion().subscribe(region => {
            this.region = region;
            this.persil = {};
            this.getScheme();
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onFormSubmit(): void {
        console.log(this.persil);
        this.persil.fkRegionId = this.region.id;
        this.persil.geojson = null;
        this.persil.totalSize = null;
        this.persil.totalSubject = null;

        this.persilService.createOrUpdate(this.persil, null).subscribe(
            success => {
                this.toastr.success("Persil berhasil disimpan");
                this.isSaveSuccess$.next(null);
            },
            error => {
                this.toastr.error("Ada kesalahan dalam penyimpanan");
                this.isSaveSuccess$.next(error);
            }
        );
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