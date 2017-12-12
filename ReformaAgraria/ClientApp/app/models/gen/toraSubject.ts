import { MaritalStatus } from './maritalStatus';
import { Gender } from './gender';
import { EducationalAttainment } from './educationalAttainment';
import { LandStatus } from './landStatus';
import { ToraObject } from './toraObject';
import { BaseEntity } from './baseEntity';

export interface ToraSubject extends BaseEntity<number> { 
    id: number;
    name: string;
    maritalStatus: MaritalStatus;
    address: string;
    gender: Gender;
    age?: number;
    educationalAttainment: EducationalAttainment;
    totalFamilyMembers: number;
    landStatus: LandStatus;
    landLocation: string;
    size: number;
    plantTypes: string;
    notes: string;
    fkToraObjectId: number;
    toraObject?: ToraObject;
}
