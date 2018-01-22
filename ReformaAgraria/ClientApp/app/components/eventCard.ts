import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { RegionService } from '../services/gen/region';
import { SharedService } from '../services/shared';
import { EventService } from '../services/gen/event';
import { Region } from '../models/gen/region';
import { Event } from '../models/gen/event';
import { Query } from '../models/query';

import * as moment from 'moment';

@Component({
    selector: 'ra-event-card',
    templateUrl: '../templates/eventCard.html'
})
export class EventCardComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    events: Event[];
    region: Region;

    constructor(
        private router: Router,
        private regionService: RegionService,
        private sharedService: SharedService,
        private eventService: EventService
    ) { }

    ngOnInit() {
        this.subscription = this.sharedService.getRegion().subscribe(region => {
            this.region = region;
            this.getData();
        });
    };

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getData() {
        let eventQuery: Query = { 
            sort: 'StartDate',
            page: 1,
            perPage: 10,
            data: { 'type': 'getAllByParent', 'parentId': this.region.id, 'startDate': moment().format('DD/MM/YYYY') } 
        }
        this.eventService.getAll(eventQuery, null).subscribe(events => {
            events.forEach(event => {
                event.startDate = event.startDate ? moment.utc(event.startDate).toDate() : null;
                event.endDate = event.endDate ? moment.utc(event.endDate).toDate() : null;
            })
            this.events = events;
        })
    }

    onCardClicked(event: Event) {
        let regionId = this.region.id.split('.').join('_');
        this.router.navigate(['calendar', regionId], {queryParams: { date: moment(event.startDate).format('DD-MM-YYYY') } });
    }

}
