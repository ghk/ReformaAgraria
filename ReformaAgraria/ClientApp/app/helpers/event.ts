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

    static deserialize(event: Event, actions?:CalendarEventAction[]) : CalendarEvent<Event> {
        let evColor = this.getEventColor(event);
        let color = {
            primary: evColor,
            secondary: evColor
        };

        let calEvent: CalendarEvent<Event> = {
            start: event.startDate ? moment.utc(event.startDate).toDate() : null,
            end: event.endDate ? moment.utc(event.endDate).toDate() : null,
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

    static getEventColor(event: Event): string {
        switch(event.eventType.id) {
            case '1.1':
            case '1.2':
            case '1.3':
            case '1.4':
            case '1.5':
            case '1.6':
            case '2.7':
            case '2.8':
            case '3.1':
            case '3.2':
                return '#B2DD50';
            case '2.2':
            case '2.4':
            case '2.5':
                return '#BEB190';
            case '2.1':
            case '2.3':
            case '2.6':
                return '#7FCE5B';
            case '3.3':
            case '3.4':
            case '4':
                return '#F79C18';
            default:
                return '#BEB190'
        }

    }
}