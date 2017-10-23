import { RegionType } from './regionType';
import { Region } from './region';
import { BaseEntity } from './baseEntity';

export interface Region extends BaseEntity<string> { 
	id: string;
	name: string;
	type: RegionType;
	isKelurahan: boolean;
	fkParentId: string;
	parent: Region;
}
