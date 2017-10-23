import { BaseEntity } from './BaseEntity';

export interface PoliciesDocument extends BaseEntity<number> { 
	id: number;
	title: string;
	attachment: string;
}
