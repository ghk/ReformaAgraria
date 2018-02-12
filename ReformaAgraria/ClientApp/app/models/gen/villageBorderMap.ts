import { Region } from './region';
import { BaseEntity } from './baseEntity';

export interface VillageBorderMap extends BaseEntity<number> { 
    id?: number;
    name?: string;
    geojson?: string;
    size?: number;
    fkRegionId?: string;
    region?: Region;
}
