import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { BsModalRef } from "ngx-bootstrap";
import { Progress } from "angular-progress-http";
import { ToastrService } from "ngx-toastr";

import { LandStatus } from '../../models/gen/landStatus';
import { Status } from '../../models/gen/status';
import { RegionalStatus } from '../../models/gen/regionalStatus';

import { Query } from "../../models/query";
import { Region } from "../../models/gen/region";
import { ToraObject } from "../../models/gen/toraObject";
import { SharedService } from "../../services/shared";
import { RegionService } from "../../services/gen/region";
import { ToraObjectService } from "../../services/gen/toraObject";


@Component({
    selector: 'modal-tora-object-form',
    templateUrl: '../../templates/modals/toraObjectForm.html',
})
export class ModalToraObjectFormComponent implements OnInit, OnDestroy {   
    progress: Progress;
    subscription: Subscription;    
    
    LandStatus = LandStatus;
    RegionalStatus = RegionalStatus;
    Status = Status;
    
    toraObject: ToraObject;
    kecamatan: Region;
    kabupaten: Region;
    desa: Region;  

    constructor(
        public bsModalRef: BsModalRef,
        private toastr: ToastrService,
        private sharedService: SharedService,
        private regionService: RegionService,
        private toraObjectService: ToraObjectService,
    ) { }

    ngOnInit(): void {
        this.toraObject = {};
        this.subscription = this.sharedService.getRegion().subscribe(region => {       
            this.getRegion(region);
            this.toraObject.fkRegionId = region.id;
        });
    }

    ngOnDestroy(): void {        
        this.subscription.unsubscribe();
    }  
   
    setToraObject(toraObject: ToraObject): void {
        if (toraObject) {
            this.toraObject = toraObject;
        }
    }

    getRegion(region: Region): void {
        let depthQuery = { 
            data: {
                'type': 'getByDepth',
                'depth': 2
            }
        };
                    
        this.regionService.getById(region.id, depthQuery, null).subscribe(region => {
            this.desa = region;
            this.kecamatan = region.parent;
            this.kabupaten = region.parent.parent;
        });
    }

    onFormSubmit(): void {
        this.toraObjectService.createOrUpdate(this.toraObject, null).subscribe(
            success => {
                this.toastr.success("Objek TORA berhasil disimpan");
                this.bsModalRef.hide();
            },
            error => {
                this.toastr.error("Ada kesalahan dalam penyimpanan");
                this.bsModalRef.hide();
            }
        );
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}