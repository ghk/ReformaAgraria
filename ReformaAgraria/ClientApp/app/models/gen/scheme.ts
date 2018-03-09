import { BaseEntity } from './baseEntity';

export interface Scheme extends BaseEntity<number> { 
    id?: number;
    name?: string;
    details?: string;
}
