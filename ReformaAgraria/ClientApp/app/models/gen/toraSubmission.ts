import { BaseEntity } from './baseEntity';

export interface ToraSubmission extends BaseEntity<number> { 
	id: number;
	attachment: string;
}
