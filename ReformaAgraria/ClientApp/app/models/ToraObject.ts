import { RegionalStatus } from './RegionalStatus';
import { LandType } from './LandType';
import { ProposedTreatment } from './ProposedTreatment';
import { LandStatus } from './LandStatus';
import { Region } from './Region';
import { BaseEntity } from './BaseEntity';

export interface ToraObject extends BaseEntity<number> { 
	id: number;
	size: number;
	totalTenants: string;
	regionalStatus: RegionalStatus;
	landType: LandType;
	livelihood: string;
	proposedTreatment: ProposedTreatment;
	landStatus: LandStatus;
	landTenureHistory: string;
	fkRegionId: string;
	region: Region;
}
