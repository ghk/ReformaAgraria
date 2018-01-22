import { BaseEntity } from './baseEntity';

export interface Library extends BaseEntity<number> { 
    id?: number;
    title?: string;
    fileExtension?: string;
}
