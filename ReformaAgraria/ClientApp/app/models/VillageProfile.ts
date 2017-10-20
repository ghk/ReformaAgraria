import { Region } from './Region';
import { BaseEntity } from './BaseEntity';

export interface VillageProfile extends BaseEntity<number> { 
	id: number;
	history: string;
	potential: string;
	tenurialCondition: string;
	fkRegionId: string;
	region: Region;
}
