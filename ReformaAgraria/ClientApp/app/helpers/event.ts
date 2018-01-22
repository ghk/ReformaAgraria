import { Event } from '../models/gen/event';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { EventColor } from 'calendar-utils';

import * as moment from 'moment';

export class EventHelper {

    static serialize(calEvent: CalendarEvent<Event>): Event {
        let event: Event = {
            id: calEvent.meta.id,
            title: calEvent.title,
            description: calEvent.meta.description,
            startDate: calEvent.start,
            endDate: calEvent.end,
            fkRegionId: calEvent.meta.fkRegionId
        };
        return event;
    }

    static deserialize(event: Event, actions?:CalendarEventAction[]) : CalendarEvent<Event> {
        let color = {
            primary: '#ad2121',
            secondary: '#FAE3E3'
        };
        let calEvent: CalendarEvent<Event> = {
            start: event.startDate ? moment.utc(event.startDate).toDate() : null,
            end: event.endDate ? moment.utc(event.endDate).toDate() : null,
            title: event.title,
            color: color,
            draggable: true,
            resizable: {
                beforeStart: true,
                afterEnd: true
            },        
            actions: actions ? actions : [],
            meta: event
        };
        return calEvent;
    }

    static serializeMany(calEvents: CalendarEvent<Event>[]) : Event[] {
        let events = [];
        calEvents.forEach(calEvent => {
            events.push(this.serialize(calEvent));
        });
        return events;
    }

    static deserializeMany(events: Event[], actions?:CalendarEventAction[]) : CalendarEvent[] {
        let calEvents = [];
        events.forEach(event => {
            calEvents.push(this.deserialize(event, actions));
        });
        return calEvents;
    }
}