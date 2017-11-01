import { Region } from './region';
import { BaseEntity } from './baseEntity';

export interface VillageProfile extends BaseEntity<number> { 
    id: number;
    history: string;
    potential: string;
    tenurialCondition: string;
    fkRegionId: string;
    region?: Region;
}
