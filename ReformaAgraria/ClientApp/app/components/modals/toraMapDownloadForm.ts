import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { Progress } from 'angular-progress-http';
import { saveAs } from 'file-saver';

import { Query } from '../../models/query';
import { SearchViewModel } from '../../models/gen/searchViewModel';
import { ToraMap } from '../../models/gen/toraMap';

import { SharedService } from '../../services/shared';
import { SearchService } from '../../services/gen/search';
import { ToraMapService } from '../../services/gen/toraMap';


@Component({
    selector: 'modal-tora-map-download-form',
    templateUrl: '../../templates/modals/toraMapDownloadForm.html',
})
export class ModalToraMapDownloadFormComponent implements OnInit, OnDestroy {   
    progress: Progress;
    subscription: Subscription;  
    
    selected: any;
    selectedRegionId: any;
    dataSource: any;  
        
    model: any = {};        
    toraMaps: ToraMap[] = [];

    constructor(
        public bsModalRef: BsModalRef,
        private sharedService: SharedService,
        private searchService: SearchService,
        private toraMapService: ToraMapService
    ) { }

    ngOnInit(): void {
        this.subscription = this.sharedService.getRegion().subscribe(region => {       
            this.selectedRegionId = region.id;
            this.selected = region.name;
            this.getToraMaps();
        });

        this.dataSource = Observable.create((observer: any) => { observer.next(this.selected); })
            .switchMap((keywords: string) => this.searchService.searchRegion(keywords))
            .catch((error: any) => { return []; });
    }

    ngOnDestroy(): void {        
        this.subscription.unsubscribe();
    } 

    getToraMaps() {
        let query = { data: { 'type': 'getAllByRegion', 'regionId': this.selectedRegionId } }
        this.toraMapService.getAll(query, this.progressListener.bind(this)).subscribe(data => {
            this.toraMaps = data;
        });     
    }
        
    onFormSubmit(): void {                  
        this.toraMapService.download(this.model.toraMap.id).subscribe(data => {
            let blob = new Blob([data.blob()], { type: 'application/zip' });
            saveAs(blob, this.model.toraMap.name + '.zip');
        });
    }

    onSearchSelected(model: any) {
        let svm: SearchViewModel = model.item;
        this.selectedRegionId = svm.value.id;
        this.getToraMaps();
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}