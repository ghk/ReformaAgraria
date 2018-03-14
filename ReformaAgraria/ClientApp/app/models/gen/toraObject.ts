import { RegionalStatus } from './regionalStatus';
import { LandStatus } from './landStatus';
import { Status } from './status';
import { Region } from './region';
import { Scheme } from './scheme';
import { ToraSubject } from './toraSubject';
import { BaseEntity } from './baseEntity';

export interface ToraObject extends BaseEntity<number> { 
    id?: number;
    name?: string;
    size?: number;
    totalSubjects?: number;
    regionalStatus?: RegionalStatus;
    landType?: string;
    livelihood?: string;
    proposedTreatment?: string;
    landStatus?: LandStatus;
    landTenureHistory?: string;
    conflictChronology?: string;
    formalAdvocacyProgress?: string;
    nonFormalAdvocacyProgress?: string;
    status?: Status;
    fkRegionId?: string;
    fkSchemeId?: number;
    region?: Region;
    scheme?: Scheme;
    toraSubjects?: ToraSubject[];
}
