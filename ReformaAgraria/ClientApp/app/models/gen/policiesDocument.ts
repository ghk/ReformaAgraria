import { BaseEntity } from './baseEntity';

export interface PoliciesDocument extends BaseEntity<number> { 
    id: number;
    title: string;
    attachment: string;
}
