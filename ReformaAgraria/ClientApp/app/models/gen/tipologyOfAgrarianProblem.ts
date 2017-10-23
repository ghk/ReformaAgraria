import { Codefication } from './codefication';
import { ProposedTreatment } from './proposedTreatment';
import { LandType } from './landType';
import { Coordinate } from './coordinate';
import { Region } from './region';
import { BaseEntity } from './baseEntity';

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
