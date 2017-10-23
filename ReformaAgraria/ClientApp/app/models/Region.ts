import { RegionType } from './RegionType';
import { Region } from './Region';
import { BaseEntity } from './BaseEntity';

export interface Region extends BaseEntity<string> { 
	id: string;
	name: string;
	type: RegionType;
	isKelurahan: boolean;
	fkParentId: string;
	parent: Region;
}
