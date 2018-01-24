import { RegionType } from './regionType';
import { BaseEntity } from './baseEntity';

export interface EventType extends BaseEntity<string> { 
    id?: string;
    name?: string;
    regionType?: RegionType;
}
