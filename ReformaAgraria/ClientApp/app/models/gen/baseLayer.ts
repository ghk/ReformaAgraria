import { BaseEntity } from './baseEntity';

export interface BaseLayer extends BaseEntity<number> { 
    id: number;
    label: string;
    color: string;
    geojson: string;
}
