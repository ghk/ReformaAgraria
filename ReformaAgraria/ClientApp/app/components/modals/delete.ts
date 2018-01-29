import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { BsModalRef } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Progress } from "angular-progress-http";

import { SharedService } from "../../services/shared";
import { BaseEntity } from "../../models/gen/baseEntity";
import { CrudService } from "../../services/crud";


@Component({
    selector: 'modal-delete',
    templateUrl: '../../templates/modals/delete.html',
})
export class ModalDeleteComponent implements OnInit, OnDestroy {   
    subscription: Subscription;
    model: BaseEntity<any>;
    label: string;
    service: CrudService<BaseEntity<any>, any>;
    progress: Progress; 

    constructor(
        public bsModalRef: BsModalRef,
        private toastrService: ToastrService,
    ) { }

    ngOnInit(): void {        
    }

    ngOnDestroy(): void {
    }

    onConfirmDelete(): void {
        this.service.deleteById(this.model.id, null).subscribe(
            success => {
                this.toastrService.success("Data berhasil dihapus");
                this.bsModalRef.hide();
            },
            error => {
                this.toastrService.error("Ada kesalahan dalam penghapusan");
                this.bsModalRef.hide();
            }
        );
    }
    
    setModel(model: BaseEntity<any>): void {
        this.model = model;
    }

    setService(service: CrudService<BaseEntity<any>, any>): void {
        this.service = service;
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}