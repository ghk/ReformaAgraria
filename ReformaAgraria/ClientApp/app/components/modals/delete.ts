import { Component, OnInit, OnDestroy } from "@angular/core";
import { ReplaySubject } from "rxjs";
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
    model: BaseEntity<any>;
    label: string;
    service: CrudService<BaseEntity<any>, any>;
    progress: Progress; 

    private isDeleteSuccess$: ReplaySubject<any> = new ReplaySubject(1);   

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
                this.isDeleteSuccess$.next(null);
            },
            error => {
                this.toastrService.error("Ada kesalahan dalam penghapusan");
                this.isDeleteSuccess$.next(error);
            }
        );
    }   
    
    setModel(model: BaseEntity<any>): void {
        this.model = model;
    }

    setService(service: CrudService<BaseEntity<any>, any>): void {
        this.service = service;
    }

    setLabel(label: string): void {
        this.label = label;
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}