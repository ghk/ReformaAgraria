import { Codefication } from './Codefication';
import { ProposedTreatment } from './ProposedTreatment';
import { LandType } from './LandType';
import { Coordinate } from './Coordinate';
import { Region } from './Region';
import { BaseEntity } from './BaseEntity';

export interface TipologyOfAgrarianProblem extends BaseEntity<number> { 
	id: number;
	totalFamily: number;
	totalPeople: number;
	size: number;
	mainProblem: string;
	codefication: Codefication;
	proposedTreatment: ProposedTreatment;
	individualSubjectDataCheckList: boolean;
	communalSubjectDataCheckList: boolean;
	objectDataCheckList: boolean;
	landTenureHistoryDataCheckList: boolean;
	contactPerson: string;
	landType: LandType;
	proposedSize: number;
	habitationSize: number;
	paddyFieldSize: number;
	gardenSize: number;
	fieldSize: number;
	farmSize: number;
	forestSize: number;
	mereSize: number;
	fkCoordinateId: number;
	coordinate: Coordinate;
	fkRegionId: string;
	region: Region;
}
