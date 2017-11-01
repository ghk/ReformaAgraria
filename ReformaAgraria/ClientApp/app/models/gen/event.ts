import { RegionType } from './regionType';
import { BaseEntity } from './baseEntity';

export interface Event extends BaseEntity<number> { 
    id: number;
    title: string;
    agenda: string;
    regionType: RegionType;
    place: string;
    startDate: Date;
    endDate: Date;
    notes: string;
}
