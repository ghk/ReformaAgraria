import { Event } from '../models/gen/event';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { EventColor } from 'calendar-utils';

import * as moment from 'moment';

export class EventHelper {

    static serialize(calEvent: CalendarEvent<Event>): Event {
        let event: Event = {
            id: calEvent.meta.id,
            description: calEvent.meta.description,
            startDate: calEvent.start,
            endDate: calEvent.end,
            fkRegionId: calEvent.meta.fkRegionId,
            fkEventTypeId: calEvent.meta.fkEventTypeId
        };
        return event;
    }

    static deserialize(event: Event, actions?: CalendarEventAction[]): CalendarEvent<Event> {
        let evColor = this.getEventColor(event);
        let color = {
            primary: evColor,
            secondary: evColor
        };

        event.startDate = event.startDate ? moment.utc(event.startDate).local().toDate() : null;
        event.endDate = event.endDate ? moment.utc(event.endDate).local().toDate() : null;

        let calEvent: CalendarEvent<Event> = {
            start: event.startDate,
            end: event.endDate,
            title: event.eventType.name,
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

    static serializeMany(calEvents: CalendarEvent<Event>[]): Event[] {
        let events = [];
        calEvents.forEach(calEvent => {
            events.push(this.serialize(calEvent));
        });
        return events;
    }

    static deserializeMany(events: Event[], actions?: CalendarEventAction[]): CalendarEvent[] {
        let calEvents = [];
        events.forEach(event => {
            calEvents.push(this.deserialize(event, actions));
        });
        return calEvents;
    }

    static getEventColor(event: Event): string {
        switch (event.region.type) {
            case 2:
                return '#09833A'
            case 3:
                return '#BBD86E'
            case 4:
                return '#C3976A'
            default:
                return '#C3976A'
        }

    }
}