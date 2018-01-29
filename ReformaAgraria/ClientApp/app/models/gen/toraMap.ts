import { ToraObject } from './toraObject';
import { Region } from './region';
import { BaseEntity } from './baseEntity';

export interface ToraMap extends BaseEntity<number> { 
    id?: number;
    name?: string;
    geojson?: string;
    size?: number;
    fkToraObjectId?: number;
    fkRegionId?: string;
    toraObject?: ToraObject;
    region?: Region;
}
