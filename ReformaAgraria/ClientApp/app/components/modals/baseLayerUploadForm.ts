import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ColorPickerService } from 'ngx-color-picker';
import { BsModalRef } from 'ngx-bootstrap';
import { Progress } from 'angular-progress-http';
import { ToastrService } from 'ngx-toastr';

import { Query } from '../../models/query';
import { UploadBaseLayerViewModel } from '../../models/gen/uploadBaseLayerViewModel';
import { BaseLayerService } from '../../services/gen/baseLayer';

@Component({
    selector: 'modal-baselayer-upload-form',
    templateUrl: '../../templates/modals/baseLayerUploadForm.html',
})
export class ModalBaseLayerUploadFormComponent implements OnInit, OnDestroy { 
    @ViewChild('baseLayerFile')  
    baseLayerFileRef: ElementRef;

    progress: Progress;

    model: UploadBaseLayerViewModel = {};
    
    color: string = '#127bdc';       
    downloadLink: string = '';

    private isSaveSuccess$: ReplaySubject<any> = new ReplaySubject(1);   

    constructor(
        public bsModalRef: BsModalRef,
        private toastr: ToastrService,
        private cpService: ColorPickerService,
        private baseLayerService: BaseLayerService
    ) { }

    ngOnInit(): void {}

    ngOnDestroy(): void {}  

    setModel(model: UploadBaseLayerViewModel): void {
        if (model) {
            this.model = model;
            this.downloadLink = [window.location.origin, 'baseLayer', model.id + ".zip"].join("/")
        } 
    }
        
    onFormSubmit(): void {                  
        let formData = new FormData();
        if (this.model.id)
            formData.append('id', this.model.id.toString());
        formData.append('label', this.model.label);
        formData.append('color', this.color);
        formData.append('file', this.model.file)

        this.baseLayerService.upload(formData).subscribe(
            data => {
                this.toastr.success('Upload File Berhasil', null);
                this.baseLayerFileRef.nativeElement.value = null;
                this.isSaveSuccess$.next(null);
            },
            error => {
                this.toastr.error('Ada kesalahan dalam penyimpanan', null);
                this.isSaveSuccess$.next(error);
            }
        );
    }

    onSelectFile(file: File) {
        this.model.file = file;
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}