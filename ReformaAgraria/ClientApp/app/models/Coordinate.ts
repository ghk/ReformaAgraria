import { BaseEntity } from './BaseEntity';

export interface Coordinate extends BaseEntity<number> { 
	id: number;
	latitude: number;
	longitude: number;
}
