import { Region } from './region';
import { EventType } from './eventType';
import { BaseEntity } from './baseEntity';

export interface Event extends BaseEntity<number> { 
    id?: number;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    fkRegionId?: string;
    region?: Region;
    fkEventTypeId?: string;
    eventType?: EventType;
}
