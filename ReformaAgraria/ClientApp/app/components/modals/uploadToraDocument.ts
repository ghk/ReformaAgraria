import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { ReplaySubject, Subscription } from "rxjs";
import { BsModalRef } from "ngx-bootstrap";
import { Progress } from "angular-progress-http";
import { ToastrService } from "ngx-toastr";

import { SharedService } from "../../services/shared";
import { ToraObjectService } from "../../services/gen/toraObject";

import { Region } from "../../models/gen/region";
import { UploadToraDocumentViewModel } from "../../models/gen/uploadToraDocumentViewModel";

@Component({
    selector: 'modal-upload-tora-document',
    templateUrl: '../../templates/modals/uploadToraDocument.html',
})
export class ModalUploadToraDocumentComponent implements OnInit, OnDestroy {   
    subscription: Subscription;

    region: Region;
    model: UploadToraDocumentViewModel;

    private isSaveSuccess$: ReplaySubject<any> = new ReplaySubject(1);
    
    progress: Progress;

    constructor(
        public bsModalRef: BsModalRef,
        private toastr: ToastrService,
        private sharedService: SharedService,
        private toraObjectService: ToraObjectService
    ) { }

    ngOnInit(): void {
        this.model = {};
        this.subscription = this.sharedService.getRegion().subscribe(region => {
            this.region = region;
        })
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onChangeFile(file: File) {
        this.model.file = file;
    }

    onUpload(): void {
        let formData = new FormData();        
        formData.append('regionId', this.region.id);
        formData.append('file', this.model.file);

        this.toraObjectService.upload(formData, this.progressListener.bind(this))
            .subscribe(
            data => {
                this.toastr.success('File berhasil diupload')
                this.isSaveSuccess$.next(null);
            },
            error => {
                this.toastr.error('Upload file gagal')
                this.isSaveSuccess$.next(error);
            }
        );
    }

    onDownloadTemplate() {
        var link = [window.location.origin, 'template', 'Template_Example_Object_Subject_Tora.xlsx'].join("/")
        $("#download").attr("href", link);
        $('#download')[0].click();
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}