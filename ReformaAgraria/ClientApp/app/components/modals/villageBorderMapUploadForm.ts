import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ReplaySubject, Subscription, Observable } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { Progress } from 'angular-progress-http';
import { ToastrService } from 'ngx-toastr';

import { Query } from '../../models/query';
import { UploadVillageBorderMapViewModel } from "../../models/gen/uploadVillageBorderMapViewModel";
import { SearchViewModel } from '../../models/gen/searchViewModel';

import { SharedService } from '../../services/shared';
import { SearchService } from '../../services/gen/search';
import { VillageBorderMapService } from "../../services/gen/villageBorderMap";


@Component({
    selector: 'modal-village-border-map-upload-form',
    templateUrl: '../../templates/modals/villageBorderMapUploadForm.html',
})
export class ModalVillageBorderMapUploadFormComponent implements OnInit, OnDestroy {   
    @ViewChild('villageBorderMapFile')
    villageBorderMapFileRef: ElementRef;

    progress: Progress;
    subscription: Subscription;  
    
    selected: any;
    selectedRegionId: any;
    dataSource: any;  
    regionType: number;
        
    model: UploadVillageBorderMapViewModel = {};   

    private isSaveSuccess$: ReplaySubject<any> = new ReplaySubject(1);   

    constructor(
        public bsModalRef: BsModalRef,
        private toastr: ToastrService,
        private sharedService: SharedService,
        private searchService: SearchService,
        private villageBorderMapService: VillageBorderMapService
    ) { }

    ngOnInit(): void {
        this.subscription = this.sharedService.getRegion().subscribe(region => {       
            this.selectedRegionId = region.id;
            this.selected = region.name;
            this.model.regionId = region.id;
            this.regionType = region.type;
        });

        this.dataSource = Observable.create((observer: any) => { observer.next(this.selected); })
            .switchMap((keywords: string) => this.searchService.searchRegion(keywords))
            .catch((error: any) => { return []; });
    }

    ngOnDestroy(): void {        
        this.subscription.unsubscribe();
    } 
        
    onFormSubmit(): void {           
        let formData = new FormData();
        formData.append('regionId', this.model.regionId.toString());
        formData.append('file', this.model.file);

        this.villageBorderMapService.upload(formData).subscribe(
            data => {
                this.toastr.success('Upload File Berhasil', null);
                this.villageBorderMapFileRef.nativeElement.value = '';
                this.sharedService.setReloadVillageBorderMap(true);
                this.isSaveSuccess$.next(null);
            },
            error => {
                this.toastr.error('Ada kesalahan dalam upload', null);
                this.isSaveSuccess$.next(error);
            }
        )
    }

    onSearchSelected(model: any) {
        let svm: SearchViewModel = model.item;
        this.selectedRegionId = svm.value.id;
    }

    onSelectFile(file: File) {
        this.model.file = file;
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}