import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker/bs-locale.service';

import { Query } from '../models/query';
import { Region } from '../models/gen/region';
import { Event } from '../models/gen/event';
import { EventType } from '../models/gen/eventType';
import { SearchViewModel } from '../models/gen/searchViewModel';

import { SharedService } from '../services/shared';
import { RegionService } from '../services/gen/region';
import { EventService } from '../services/gen/event';

import { EventHelper } from '../helpers/event';
import { CustomDateFormatter } from '../helpers/customDateFormatter';
import { ModalEventFormComponent } from "./modals/eventForm";

import {
    CalendarEvent,
    CalendarDateFormatter,
    CalendarEventTimesChangedEvent,
    DAYS_OF_WEEK,
    CalendarEventAction
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

import * as moment from 'moment';
import { ModalDeleteComponent } from './modals/delete';

@Component({
    selector: 'ra-event-calendar',
    templateUrl: '../templates/eventCalendar.html',
    providers: [{ provide: CalendarDateFormatter, useClass: CustomDateFormatter }]
})
export class EventCalendarComponent implements OnInit, OnDestroy {
    eventFormModalRef: BsModalRef;
    deleteModalRef: BsModalRef;    

    region: Region;    
    routeParamsSubscription: Subscription;
    routeQueryParamsSubscription: Subscription;
    eventFormSubscription: Subscription;
    deleteSubscription: Subscription;

    event: Event;
    events: Event[];
    eventTypes: EventType[];
    calEvents: CalendarEvent[] = [];

    view: string = 'month';
    viewDate: Date = new Date();
    activeDayIsOpen: boolean = false;
    refresh: Subject<any> = new Subject();
    locale: string = 'id-ID';
    weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
    weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];
    
    minDate: Date = new Date();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService,
        private toastrService: ToastrService,
        private bsLocaleService: BsLocaleService,
        private sharedService: SharedService,
        private regionService: RegionService,
        private eventService: EventService,
    ) { }

    ngOnInit(): void {
        this.bsLocaleService.use('id');

        this.routeParamsSubscription = this.route.params.subscribe(params => {
            let regionId: string = params['id'] !== null ? params['id'] : '72.1';
            regionId = regionId.replace(/_/g, '.');
            this.regionService.getById(regionId, null, null).subscribe(region => {
                this.region = region;
                this.sharedService.setRegion(region);
                this.getData();
            })
        });

        this.routeQueryParamsSubscription = this.route.queryParams.subscribe(params => {
            let dateParam = params['date'] || null;
            if (!dateParam)
                return;

            let momentDate = moment(dateParam, 'DD-MM-YYYY');
            if (momentDate.isValid()) {
                this.viewDate = momentDate.toDate();
                this.activeDayIsOpen = true;
            };
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        this.routeQueryParamsSubscription.unsubscribe();
        if (this.eventFormSubscription)
            this.eventFormSubscription.unsubscribe();
        if (this.deleteSubscription)
            this.deleteSubscription.unsubscribe();
    }

    getData(): void {
        let eventQuery: Query = { data: { 'type': 'getAllByParent', 'parentId': this.region.id } };
        this.eventService.getAll(eventQuery, null).subscribe(events => {
            this.events = events;
            this.calEvents = EventHelper.deserializeMany(events, this.getActions());
        });
    }

    getActions(): CalendarEventAction[] {
        return [
            {
                label: '<i class="oi oi-pencil p-2"></i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.onHandleEvent('Edited', event);
                }
            },
            {
                label: '<i class="oi oi-trash p-2"></i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.onHandleEvent('Deleted', event);
                }
            }
        ];
    }

    onDayClicked({ date, events }: { date: Date; events: CalendarEvent<Event>[] }): void {
        if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
            this.activeDayIsOpen = false;
        } else {
            this.activeDayIsOpen = true;
            this.viewDate = date;
        }
    }

    onEventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
        let ev: CalendarEvent<Event> = event;
        let oldEvent = JSON.parse(JSON.stringify(event));
        ev.meta.startDate = newStart;
        ev.meta.endDate = newEnd;

        this.eventService.update(ev.meta, null).subscribe(
            result => {
                this.toastrService.success("Event berhasil disimpan");
                this.getData();
            },
            error => {
                this.toastrService.error("Ada kesalahan dalam penyimpanan");
                event = oldEvent;
                this.refresh.next();
            }
        );
    }

    onHandleEvent(action: string, event: CalendarEvent<Event>): void {
        if (action === 'Edited') {
            this.onShowEventForm(event.meta);
        }
        if (action === 'Deleted') {
            this.onDeleteEvent(event.meta);
        }
        if (action === 'Clicked') {
            this.router.navigateByUrl('event/' + event.meta.id);
        }
    }
    
    onShowEventForm(event: Event): void {
        this.eventFormModalRef = this.modalService.show(ModalEventFormComponent, { 'class': 'modal-lg' });
        this.eventFormModalRef.content.setEvent(event);
        if (!this.eventFormSubscription)
            this.eventFormSubscription = this.eventFormModalRef.content.isSaveSuccess$.subscribe(error => {
                if (!error) {
                    this.getData();                    
                }
                this.eventFormSubscription.unsubscribe();
                this.eventFormSubscription = null;
                this.eventFormModalRef.hide();
            });
    }

    onDeleteEvent(event: Event): void {
        this.deleteModalRef = this.modalService.show(ModalDeleteComponent);
        this.deleteModalRef.content.setModel(event);
        this.deleteModalRef.content.setService(this.eventService);
        this.deleteModalRef.content.setLabel("Kegiatan");
        if (!this.deleteSubscription)
            this.deleteSubscription = this.deleteModalRef.content.isDeleteSuccess$.subscribe(error => {
                if (!error) {
                    this.getData();                    
                }
                this.deleteSubscription.unsubscribe();
                this.deleteSubscription = null;
                this.deleteModalRef.hide();
            });
    }

   
}