import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

import { SharedService } from '../services/shared';
import { Region } from '../models/gen/region';
import { Event } from '../models/gen/event';
import { RegionService } from '../services/gen/region';
import { EventService } from '../services/gen/event';
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
    providers: [
        {
            provide: CalendarDateFormatter,
            useClass: CustomDateFormatter
        }
    ]
})
export class EventCalendarComponent implements OnInit, OnDestroy {
    region: Region;
    subscription: Subscription;

    events: Event[];
    calEvents: CalendarEvent[] = [];
    newCalEvent: CalendarEvent;

    view: string = 'month';
    viewDate: Date = new Date();
    activeDayIsOpen: boolean = false;
    refresh: Subject<any> = new Subject();

    locale: string = 'id-ID';
    weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
    weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

    constructor(
        private route: ActivatedRoute,
        private sharedService: SharedService,
        private regionService: RegionService,
        private eventService: EventService
    ) { }

    ngOnInit(): void {
        this.subscription = this.route.params.subscribe(params => {
            let regionId: string = params['id'] !== null ? params['id'] : '72.1';
            regionId = regionId.replace(/_/g, '.');
            this.regionService.getById(regionId, null, null).subscribe(region => {
                this.region = region;
                this.sharedService.setRegion(region);
                this.getData();
            })
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getData(): void {
        let eventQuery = { data: { 'type': 'getAllByRegion', 'regionId': this.region.id } }
        this.eventService.getAll(eventQuery, null).subscribe(events => {
            this.events = events;
            this.calEvents = EventHelper.deserializeMany(events);
        });
    }

    onDayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
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

    onHandleEvent(action: string, event: CalendarEvent): void {
        console.log('handled');
        //this.modalData = { event, action };
        //this.modal.open(this.modalContent, { size: 'lg' });
    }

    onAddEvent(): void {

    }
}