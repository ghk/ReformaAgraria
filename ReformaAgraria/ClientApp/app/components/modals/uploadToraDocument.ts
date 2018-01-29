import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
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

    private isUploadSuccess$ = new BehaviorSubject<boolean>(false);

    @Input()
    set isUploadSuccess(value) { 
        this.isUploadSuccess$.next(value);
    }
    get isUploadSuccess() {
        return this.isUploadSuccess$.getValue();
    }
    
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
                this.isUploadSuccess = true;
            },
            error => {
                this.toastr.error('Unable to upload the file')
                this.isUploadSuccess = false;
            }
        );
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}