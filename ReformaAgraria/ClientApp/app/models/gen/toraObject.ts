import { RegionalStatus } from './regionalStatus';
import { LandType } from './landType';
import { ProposedTreatment } from './proposedTreatment';
import { LandStatus } from './landStatus';
import { Region } from './region';
import { BaseEntity } from './baseEntity';

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
