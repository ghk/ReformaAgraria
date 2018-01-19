import { Region } from './region';
import { BaseEntity } from './baseEntity';

export interface Event extends BaseEntity<number> { 
    id: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    fkRegionId: string;
    region?: Region;
}
