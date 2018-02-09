import { Region } from './region';
import { EventType } from './eventType';
import { BaseEntity } from './baseEntity';

export interface Event extends BaseEntity<number> { 
    id?: number;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    resultDescription?: string;
    attendees?: string;
    fkRegionId?: string;
    region?: Region;
    fkEventTypeId?: string;
    eventType?: EventType;
}
