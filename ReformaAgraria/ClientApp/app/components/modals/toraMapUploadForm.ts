import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ReplaySubject, Subscription, Observable } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { Progress } from 'angular-progress-http';
import { ToastrService } from 'ngx-toastr';

import { Query } from '../../models/query';
import { UploadToraMapViewModel } from '../../models/gen/uploadToraMapViewModel';
import { SearchViewModel } from '../../models/gen/searchViewModel';
import { ToraObject } from '../../models/gen/toraObject';

import { SharedService } from '../../services/shared';
import { ToraObjectService } from '../../services/gen/toraObject';
import { ToraMapService } from '../../services/gen/toraMap';
import { SearchService } from '../../services/gen/search';


@Component({
    selector: 'modal-tora-map-upload-form',
    templateUrl: '../../templates/modals/toraMapUploadForm.html',
})
export class ModalToraMapUploadFormComponent implements OnInit, OnDestroy {   
    @ViewChild('toraMapFile')
    toraMapFile: ElementRef;

    progress: Progress;
    subscription: Subscription;  
    
    selected: any;
    selectedRegionId: any;
    dataSource: any;  
        
    model: UploadToraMapViewModel = {};        
    toraObjects: ToraObject[] = [];

    private isSaveSuccess$: ReplaySubject<any> = new ReplaySubject(1);   

    constructor(
        public bsModalRef: BsModalRef,
        private toastr: ToastrService,
        private sharedService: SharedService,
        private searchService: SearchService,
        private toraObjectService: ToraObjectService,
        private toraMapService: ToraMapService
    ) { }

    ngOnInit(): void {
        this.subscription = this.sharedService.getRegion().subscribe(region => {       
            this.selectedRegionId = region.id;
            this.selected = region.name;
            this.getToraObjects();
        });

        this.dataSource = Observable.create((observer: any) => { observer.next(this.selected); })
            .switchMap((keywords: string) => this.searchService.searchRegion(keywords))
            .catch((error: any) => { return []; });
    }

    ngOnDestroy(): void {        
        this.subscription.unsubscribe();
    } 

    getToraObjects(): void {
        let query = { data: { 'type': 'getAllByRegion', 'regionId': this.selectedRegionId } }
        this.toraObjectService.getAll(query, this.progressListener.bind(this)).subscribe(data => {
            this.toraObjects = data;
        });
    }
        
    onFormSubmit(): void {           
        let formData = new FormData();
        formData.append("toraObjectId", this.model.toraObjectId.toString());
        formData.append("file", this.model.file);

        this.toraMapService.upload(formData).subscribe(
            data => {
                this.toastr.success("Upload File Berhasil", null);
                this.toraMapFile.nativeElement.value = "";
                this.sharedService.setToraMapReloadedStatus(true);
                this.isSaveSuccess$.next(null);
            },
            error => {
                this.toastr.error("Ada kesalahan dalam upload", null);
                this.isSaveSuccess$.next(error);
            }
        );
    }

    onSearchSelected(model: any) {
        let svm: SearchViewModel = model.item;
        this.selectedRegionId = svm.value;
        this.getToraObjects();
    }

    onSelectFile(file: File) {
        this.model.file = file;
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}