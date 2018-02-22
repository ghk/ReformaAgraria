import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Observable, BehaviorSubject, Subscription } from "rxjs";
import { BsModalRef } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Progress } from "angular-progress-http";

import { SharedService } from "../../services/shared";
import { EventService } from "../../services/gen/event";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { EventTypeService } from "../../services/gen/eventType";
import { SearchService } from "../../services/gen/search";

import { EventType } from "../../models/gen/eventType";
import { Event } from "../../models/gen/event";
import { SearchViewModel } from "../../models/gen/searchViewModel";
import { Query } from "../../models/query";
import { Region } from "../../models/gen/region";


@Component({
    selector: 'modal-event-form',
    templateUrl: '../../templates/modals/eventForm.html',
})
export class ModalEventFormComponent implements OnInit, OnDestroy {
    progress: Progress;
    regionSubscription: Subscription;

    region: Region;
    event: Event = {};
    eventTypes: EventType[];
    latestEventType: EventType;

    selected: any;
    selectedRegion: Region;
    dataSource: any;

    private isSaveSuccess$: ReplaySubject<any> = new ReplaySubject(1);

    constructor(
        public bsModalRef: BsModalRef,
        private toastr: ToastrService,
        private sharedService: SharedService,
        private eventService: EventService,
        private eventTypeService: EventTypeService,
        private searchService: SearchService
    ) { }

    ngOnInit(): void {
        let eventTypeQuery: Query = { sort: 'id', data: { 'type': 'getAllByRegionType', 'regionType': 2 } };
        this.eventTypeService.getAll(eventTypeQuery, null).subscribe(eventTypes => {
            this.eventTypes = eventTypes;
            
            this.regionSubscription = this.sharedService.getRegion().subscribe(region => {
                if (!this.event.fkRegionId) {
                    this.event.fkRegionId = region.id;
                    this.selected = region.name;
                    this.selectedRegion = region;
                    this.getEventByLatestEventType(region);
                }            
            });
        });

        this.dataSource = Observable.create((observer: any) => { observer.next(this.selected); })
            .switchMap((keywords: string) => this.searchService.searchRegion(keywords))
            .catch((error: any) => { console.log(error); return []; });
    }

    ngOnDestroy(): void {
        this.regionSubscription.unsubscribe();
    }

    getEventByLatestEventType(region: Region): void {
        let eventQuery: Query = { page: 1, perPage: 1, sort: '-fkEventTypeId', data: { 'type': 'getAllByRegion', 'regionId': region.id } }
        this.eventService.getAll(eventQuery, null).subscribe(events => {        
            if (events.length === 0) return;    
                    
            for(let i = 0; i < this.eventTypes.length; i++) {
                if (this.eventTypes[i].id == events[0].fkEventTypeId) {                    
                    if ((i + 1) <= this.eventTypes.length - 1) {
                        this.latestEventType = this.eventTypes[i + 1]
                        break;
                    }
                }                    
            }
        });
    }
    
    setEvent(event: Event): void {
        if (!event)
            return;
        this.event = JSON.parse(JSON.stringify(event));
        this.selected = this.event.region.name;                
    }

    onSearchSelected(model: any) {
        let svm: SearchViewModel = model.item;        
        this.selectedRegion = svm.value;
        this.event.fkRegionId = svm.value.id;
    }

    onSaveEvent(): void {   
        this.eventService.createOrUpdate(this.event, null).subscribe(
            result => {
                this.toastr.success("Event berhasil disimpan");                
                this.isSaveSuccess$.next(null);
            },
            error => {
                this.toastr.error("Ada kesalahan dalam penyimpanan");
                this.isSaveSuccess$.next(error);
            }
        );        
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}