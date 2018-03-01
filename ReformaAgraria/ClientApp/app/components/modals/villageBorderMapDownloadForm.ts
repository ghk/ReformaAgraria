import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { Progress } from 'angular-progress-http';
import { saveAs } from 'file-saver';

import { Query } from '../../models/query';
import { SearchViewModel } from '../../models/gen/searchViewModel';
import { VillageBorderMap } from '../../models/gen/villageBorderMap';

import { SharedService } from '../../services/shared';
import { SearchService } from '../../services/gen/search';
import { VillageBorderMapService } from '../../services/gen/villageBorderMap';


@Component({
    selector: 'modal-village-border-map-download-form',
    templateUrl: '../../templates/modals/villageBorderMapDownloadForm.html',
})
export class ModalVillageBorderMapDownloadFormComponent implements OnInit, OnDestroy {   
    progress: Progress;
    subscription: Subscription;  
    
    selected: any;
    selectedRegionId: any;
    dataSource: any;  
        
    model: any = {};        
    villageBorderMaps: VillageBorderMap[] = [];

    constructor(
        public bsModalRef: BsModalRef,
        private sharedService: SharedService,
        private searchService: SearchService,
        private villageBorderMapService: VillageBorderMapService
    ) { }

    ngOnInit(): void {
        this.subscription = this.sharedService.getRegion().subscribe(region => {       
            this.selectedRegionId = region.id;
            this.selected = region.name;
            this.getVillageBorderMaps();
        });

        this.dataSource = Observable.create((observer: any) => { observer.next(this.selected); })
            .switchMap((keywords: string) => this.searchService.searchRegion(keywords))
            .catch((error: any) => { return []; });
    }

    ngOnDestroy(): void {        
        this.subscription.unsubscribe();
    } 

    getVillageBorderMaps() {
        let query = { data: { 'type': 'getAllByRegion', 'regionId': this.selectedRegionId } }
        this.villageBorderMapService.getAll(query, this.progressListener.bind(this)).subscribe(data => {
            this.villageBorderMaps = data;
        });     
    }
        
    onFormSubmit(): void {                  
        this.villageBorderMapService.download(this.model.villageBorderMap.id).subscribe(data => {
            let blob = new Blob([data.blob()], { type: 'application/zip' });
            saveAs(blob, this.model.villageBorderMap.name + '_' + this.model.villageBorderMap.id + '.zip');
        });
    }

    onSearchSelected(model: any) {
        let svm: SearchViewModel = model.item;
        this.selectedRegionId = svm.value.id;
        this.getVillageBorderMaps();
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}