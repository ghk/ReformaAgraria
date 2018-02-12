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
    selector: 'modal-event-calendar-form',
    templateUrl: '../../templates/modals/eventCalendarForm.html',
})
export class ModalEventCalendarFormComponent implements OnInit, OnDestroy {
    progress: Progress;
    subscription: Subscription;
    
    event: Event = {};
    eventTypes: EventType[];
    selected: any;
    dataSource: any;
    action: string = null;

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
        let eventTypeQuery: Query = { data: { 'type': 'getAllByRegionType', 'regionType': 2 } };
        this.eventTypeService.getAll(eventTypeQuery, null).subscribe(eventTypes => {
            this.eventTypes = eventTypes;
        });
        this.dataSource = Observable.create((observer: any) => { observer.next(this.selected); })
            .switchMap((keywords: string) => this.searchService.searchRegion(keywords))
            .catch((error: any) => { console.log(error); return []; });
    }

    ngOnDestroy(): void {
    }
    
    setEvent(event: Event, region: Region, action: string): void {
        if (event != null) {
            this.event = JSON.parse(JSON.stringify(event));
            this.selected = this.event.region.name;
        }
        else {
            this.event.fkRegionId = JSON.parse(JSON.stringify(region.id));
            this.selected = region.name;
        }

        this.action = action;
    }

    onSearchSelected(model: any) {
        let svm: SearchViewModel = model.item;
        this.event.fkRegionId = svm.value;
    }

    onSaveEvent(): void {
        if (this.action === 'Ubah') {
            console.log(this.event);
            this.eventService.update(this.event, null).subscribe(
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
        else {
            this.eventService.create(this.event, null).subscribe(
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
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}