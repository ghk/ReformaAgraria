import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker/bs-locale.service';

import { SharedService } from '../services/shared';
import { Region } from '../models/gen/region';
import { Event } from '../models/gen/event';
import { SearchViewModel } from '../models/gen/searchViewModel';
import { RegionService } from '../services/gen/region';
import { EventService } from '../services/gen/event';
import { SearchService } from '../services/search';
import { EventHelper } from '../helpers/event';
import { CustomDateFormatter } from '../helpers/customDateFormatter';

import {
    CalendarEvent,
    CalendarDateFormatter,
    CalendarEventTimesChangedEvent,
    DAYS_OF_WEEK
} from 'angular-calendar';
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns';


@Component({
    selector: 'ra-event-calendar',
    templateUrl: '../templates/eventCalendar.html',
    providers: [{ provide: CalendarDateFormatter, useClass: CustomDateFormatter }]
})
export class EventCalendarComponent implements OnInit, OnDestroy {
    region: Region;
    subscription: Subscription;

    events: Event[];
    calEvents: CalendarEvent[] = [];
    modelEvent: Event;

    view: string = 'month';
    viewDate: Date = new Date();
    activeDayIsOpen: boolean = false;
    refresh: Subject<any> = new Subject();
    locale: string = 'id-ID';
    weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
    weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

    modalRef: BsModalRef;
    minDate: Date = new Date();

    selected: any;
    dataSource: any;

    constructor(
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private toastrService: ToastrService,
        private bsLocaleService: BsLocaleService,
        private sharedService: SharedService,
        private regionService: RegionService,
        private searchService: SearchService,
        private eventService: EventService
    ) { }

    ngOnInit(): void {     
        this.bsLocaleService.use('id');
        this.subscription = this.route.params.subscribe(params => {
            let regionId: string = params['id'] !== null ? params['id'] : '72.1';
            regionId = regionId.replace(/_/g, '.');
            this.regionService.getById(regionId, null, null).subscribe(region => {
                this.region = region;
                this.sharedService.setRegion(region);
                this.getData();
            })
        });

        this.dataSource = Observable.create((observer: any) => {
            observer.next(this.selected);
        }).mergeMap((keywords: string) => this.searchService.searchRegion(keywords));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getData(): void {
        let eventQuery = { data: { 'type': 'getAllByParent', 'parentId': this.region.id } }
        this.eventService.getAll(eventQuery, null).subscribe(events => {
            this.events = events;
            this.calEvents = EventHelper.deserializeMany(events);
        });
    }

    onDayClicked({ date, events }: { date: Date; events: CalendarEvent<Event>[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    onEventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.refresh.next();
    }

    onHandleEvent(action: string, event: CalendarEvent<Event>): void {
        console.log('handled');        
    }

    onAddEvent(template: TemplateRef<any>): void {        
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }

    onSaveEvent(): void {
        console.log(this.modelEvent);
        this.eventService.createOrUpdate(this.modelEvent, null).subscribe(
            result => {
                this.resetEvent();
                this.toastrService.success("Event berhasil disimpan");
                this.getData();
            },
            error => {
                this.toastrService.error("Ada kesalahan dalam penyimpanan");
            }
        );
    }

    onSearchSelected(model: any) {
        let svm: SearchViewModel = model.item;
        this.modelEvent.fkRegionId = svm.value;
    }

    resetEvent(): void {
        let event: Event = {
            title: null,
            startDate: null,
            endDate: null,
            description: null,
            fkRegionId: null
        };

        this.modelEvent = event;
    }
}