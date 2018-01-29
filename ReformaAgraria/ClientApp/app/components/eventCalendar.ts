import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { EventTypeService } from '../services/gen/eventType';
import { SearchService } from '../services/search';
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
    @ViewChild('eventModal') eventModal: TemplateRef<any>;
    @ViewChild('deleteConfirmationModal') deleteConfirmationModal: TemplateRef<any>;

    region: Region;
    subscriptions: Subscription[] = [];

    events: Event[];
    eventTypes: EventType[];
    calEvents: CalendarEvent[] = [];
    modelEvent: Event;

    view: string = 'month';
    viewDate: Date = new Date();
    activeDayIsOpen: boolean = false;
    refresh: Subject<any> = new Subject();
    locale: string = 'id-ID';
    weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
    weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

    eventModalRef: BsModalRef;
    deleteConfirmationModalRef: BsModalRef;
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
        private eventService: EventService,
        private eventTypeService: EventTypeService,
    ) { }

    ngOnInit(): void {
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

        this.dataSource = Observable.create((observer: any) => { observer.next(this.selected); } )
            .switchMap((keywords: string) => this.searchService.searchRegion(keywords))
            .catch((error: any) => { console.log(error); return []; });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getData(): void {
        let eventQuery: Query = { data: { 'type': 'getAllByParent', 'parentId': this.region.id } };
        this.eventService.getAll(eventQuery, null).subscribe(events => {
            this.events = events;
            this.calEvents = EventHelper.deserializeMany(events, this.getActions());
        });

        let eventTypeQuery: Query = { data: { 'type': 'getAllByRegionType', 'regionType': this.region.type } };
        this.eventTypeService.getAll(eventTypeQuery, null).subscribe(eventTypes => {
            this.eventTypes = eventTypes;
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
                this.resetEvent();
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
        this.modelEvent = event.meta;
        if (action === 'Edited') {           
            this.regionService.getById(event.meta.fkRegionId).subscribe(region => {
                this.selected = region.name;
                this.onAddEvent(this.eventModal); 
            });                                   
        }
        if (action === 'Deleted') {
            this.deleteConfirmationModalRef = this.modalService.show(this.deleteConfirmationModal);
        }
    }

    onAddEvent(template: TemplateRef<any>): void {
        this.eventModalRef = this.modalService.show(template, { class: 'modal-lg' });
    }

    onSaveEvent(): void {
        this.eventService.createOrUpdate(this.modelEvent, null).subscribe(
            result => {
                this.resetEvent();
                this.eventModalRef.hide();
                this.toastrService.success("Event berhasil disimpan");                
                this.getData();
            },
            error => {
                this.eventModalRef.hide();
                this.toastrService.error("Ada kesalahan dalam penyimpanan");                
            }
        );
    }

    onSearchSelected(model: any) {
        let svm: SearchViewModel = model.item;
        this.modelEvent.fkRegionId = svm.value;
    }

    onConfirmDelete(): void {
        this.eventService.deleteById(this.modelEvent.id, null).subscribe(
            result => { 
                this.resetEvent();
                this.deleteConfirmationModalRef.hide();
                this.toastrService.success("Event berhasil dihapus");                
                this.getData();
            },
            error => { 
                this.resetEvent();
                this.deleteConfirmationModalRef.hide();                
                this.toastrService.error("Ada kesalahan dalam penghapusan");                
            }
        );
    }

    onDeclineDelete(): void {
        this.resetEvent();
        this.deleteConfirmationModalRef.hide();
    }

    resetEvent(): void {
        let event: Event = {
            startDate: null,
            endDate: null,
            description: null,
            fkRegionId: null,
            fkEventTypeId: null
        };

        this.modelEvent = event;
    }
}