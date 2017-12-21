import { Region } from './region';
import { BaseEntity } from './baseEntity';

export interface ToraMap extends BaseEntity<number> { 
    id: number;
    name: string;
    geojson: string;
    fkRegionId: string;
    region?: Region;
}
