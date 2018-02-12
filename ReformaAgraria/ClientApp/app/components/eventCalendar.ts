import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalEventCalendarFormComponent } from "./modals/eventCalendarForm";
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

@Component({
    selector: 'ra-event-calendar',
    templateUrl: '../templates/eventCalendar.html',
    providers: [{ provide: CalendarDateFormatter, useClass: CustomDateFormatter }]
})
export class EventCalendarComponent implements OnInit, OnDestroy {
    @ViewChild('deleteConfirmationModal') deleteConfirmationModal: TemplateRef<any>;

    region: Region;
    subscriptions: Subscription[] = [];

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

    eventCalendarModalRef: BsModalRef;
    deleteConfirmationModalRef: BsModalRef;
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
        this.initFunction();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    initFunction() {
        this.bsLocaleService.use('id');

        this.subscriptions.push(this.route.params.subscribe(params => {
            let regionId: string = params['id'] !== null ? params['id'] : '72.1';
            regionId = regionId.replace(/_/g, '.');
            this.regionService.getById(regionId, null, null).subscribe(region => {
                this.region = region;
                this.sharedService.setRegion(region);
                this.getData();
            })
        }));

        this.subscriptions.push(this.route.queryParams.subscribe(params => {
            let dateParam = params['date'] || null;
            if (!dateParam)
                return;

            let momentDate = moment(dateParam, 'DD-MM-YYYY');
            if (momentDate.isValid()) {
                this.viewDate = momentDate.toDate();
                this.activeDayIsOpen = true;
            };
        }));
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
            this.event = event.meta;
            console.log(this.event);
            this.onShowEventCalendarForm("Ubah")
        }
        if (action === 'Deleted') {
            this.event = event.meta;
            this.deleteConfirmationModalRef = this.modalService.show(this.deleteConfirmationModal);
        }
        if (action === 'Clicked') {
            this.router.navigateByUrl('event/' + event.meta.id);
        }
    }
    
    onShowEventCalendarForm(action: string): void {
        this.eventCalendarModalRef = this.modalService.show(ModalEventCalendarFormComponent, { 'class': 'modal-lg' });
        if (action === "Ubah") {
            this.event.region = this.region;
            this.eventCalendarModalRef.content.setEvent(this.event, null, action);
        }
        else {
            this.eventCalendarModalRef.content.setEvent(null, this.region, action);
        }
        this.subscriptions.push(this.eventCalendarModalRef.content.isSaveSuccess$.subscribe(error => {
            if (!error) {
                this.initFunction();
                this.eventCalendarModalRef.hide();
            }
        }));
    }

    onConfirmDelete(): void {
        this.eventService.deleteById(this.event.id, null).subscribe(
            result => {
                this.deleteConfirmationModalRef.hide();
                this.toastrService.success("Event berhasil dihapus");
                this.getData();
            },
            error => {
                this.deleteConfirmationModalRef.hide();
                this.toastrService.error("Ada kesalahan dalam penghapusan");
            }
        );
    }

    onDeclineDelete(): void {
        this.deleteConfirmationModalRef.hide();
    }
}