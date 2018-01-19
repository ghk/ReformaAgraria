﻿import { RegionalStatus } from './regionalStatus';
import { LandStatus } from './landStatus';
import { Region } from './region';
import { BaseEntity } from './baseEntity';

export interface ToraObject extends BaseEntity<number> { 
    id: number;
    name: string;
    size: number;
    totalTenants: string;
    regionalStatus: RegionalStatus;
    landType: string;
    livelihood: string;
    proposedTreatment: string;
    landStatus: LandStatus;
    landTenureHistory: string;
    conflictChronology: string;
    formalAdvocacyProgress: string;
    nonFormalAdvocacyProgress: string;
    stages: number;
    fkRegionId: string;
    region?: Region;
}
