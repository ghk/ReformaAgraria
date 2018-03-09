import { Status } from './status';
import { Region } from './region';
import { Scheme } from './scheme';
import { BaseEntity } from './baseEntity';

export interface Persil extends BaseEntity<number> { 
    id?: number;
    status?: Status;
    totalSubject?: number;
    geojson?: string;
    totalSize?: number;
    fkRegionId?: string;
    fkSchemeId?: number;
    region?: Region;
    scheme?: Scheme;
}
