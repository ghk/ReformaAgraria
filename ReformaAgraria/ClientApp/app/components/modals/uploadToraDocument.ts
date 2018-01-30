import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { ReplaySubject, Subscription } from "rxjs";
import { BsModalRef } from "ngx-bootstrap";
import { Progress } from "angular-progress-http";
import { ToastrService } from "ngx-toastr";

import { Region } from "../../models/gen/region";
import { UploadToraDocumentViewModel } from "../../models/gen/uploadToraDocumentViewModel";
import { ToraService } from "../../services/tora";
import { SharedService } from "../../services/shared";

@Component({
    selector: 'modal-upload-tora-document',
    templateUrl: '../../templates/modals/uploadToraDocument.html',
})
export class ModalUploadToraDocumentComponent implements OnInit, OnDestroy {   
    subscription: Subscription;

    region: Region;
    model: UploadToraDocumentViewModel;

    private isSaveSuccess$: ReplaySubject<boolean> = new ReplaySubject(1);
    
    progress: Progress;

    constructor(
        public bsModalRef: BsModalRef,
        private toastr: ToastrService,
        private sharedService: SharedService,
        private toraService: ToraService
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

    onFileSelected(file: File) {
        this.model.document = file;
    }

    onUpload(): void {
        let formData = new FormData();        
        formData.append('regionId', this.region.id);
        formData.append('document', this.model.document);

        this.toraService.import(formData, this.progressListener.bind(this))
            .subscribe(
            data => {
                this.toastr.success('File is successfully uploaded')
                this.isSaveSuccess$.next(true);
            },
            error => {
                this.toastr.error('Unable to upload the file')
                this.isSaveSuccess$.next(false);
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