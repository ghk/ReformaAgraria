import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Observable, BehaviorSubject, Subscription, Subject } from "rxjs";
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
import { EventTypePipe } from "../../pipes/eventType";

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'modal-event-form',
    templateUrl: '../../templates/modals/eventForm.html',
})
export class ModalEventFormComponent implements OnInit, OnDestroy {
    progress: Progress;
    regionSubscription: Subscription;
    eventSubscription: Subscription;

    region: Region;
    event: Event = {};
    event$: ReplaySubject<Event> = new ReplaySubject(1);
    eventTypes: EventType[];

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
        this.regionSubscription = this.sharedService.getRegion().subscribe(region => {
            this.region = region;
            this.init();
        });

        this.dataSource = Observable.create((observer: any) => { observer.next(this.selected); })
            .switchMap((keywords: string) => this.searchService.searchRegion(keywords))
            .catch((error: any) => { return []; });
    }

    ngOnDestroy(): void {
        this.regionSubscription.unsubscribe();
        this.eventSubscription.unsubscribe();
    }

    async init() {
        this.eventTypes = await this.eventTypeService.getAll(null, null).toPromise();
        this.eventSubscription = this.event$.subscribe(async (event) => {
            this.event = event;          
            if (event == null) {
                this.event = {};
                this.event.fkRegionId = this.region.id;
                this.getEventByLatestEventType(this.region);
            } 

            this.selected = this.region.name;
            this.selectedRegion = this.region;
        });
    }

    async getEventByLatestEventType(region: Region) {
        if (this.event.fkEventTypeId)
            return; 

        let eventTypes = new EventTypePipe().transform(this.eventTypes, region)
        this.event.fkEventTypeId = eventTypes[0].id;        
        
        let eventQuery: Query = { page: 1, perPage: 1, sort: '-fkEventTypeId', data: { 'type': 'getAllByRegion', 'regionId': region.id } }
        let events = await this.eventService.getAll(eventQuery, null).toPromise();
        
        if (events.length === 0) return;                
        for (let i = 0; i < eventTypes.length; i++) {
            if (eventTypes[i].id == events[0].fkEventTypeId) {
                if ((i + 1) <= eventTypes.length - 1) {
                    this.event.fkEventTypeId = eventTypes[i + 1].id;
                    break;
                }
            }
        }
    }

    setEvent(event: Event): void {
        this.event$.next(JSON.parse(JSON.stringify(event)));
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