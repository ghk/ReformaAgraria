import { RegionType } from './RegionType';
import { BaseEntity } from './BaseEntity';

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
