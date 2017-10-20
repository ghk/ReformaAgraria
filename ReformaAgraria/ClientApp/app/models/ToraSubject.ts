import { MaritalStatus } from './MaritalStatus';
import { Gender } from './Gender';
import { EducationalAttainment } from './EducationalAttainment';
import { ToraObject } from './ToraObject';
import { BaseEntity } from './BaseEntity';

export interface ToraSubject extends BaseEntity<number> { 
	id: number;
	name: string;
	maritalStatus: MaritalStatus;
	address: string;
	gender: Gender;
	age: number;
	educationalAttainment: EducationalAttainment;
	totalFamilyMembers: number;
	landStatus: string;
	landLocation: string;
	size: number;
	plantTypes: string;
	notes: string;
	fkToraObjectId: number;
	toraObject: ToraObject;
}
