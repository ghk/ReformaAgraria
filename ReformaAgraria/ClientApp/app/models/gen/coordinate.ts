import { BaseEntity } from './baseEntity';

export interface Coordinate extends BaseEntity<number> { 
	id: number;
	latitude: number;
	longitude: number;
}
