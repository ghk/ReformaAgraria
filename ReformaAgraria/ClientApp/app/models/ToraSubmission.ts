import { BaseEntity } from './BaseEntity';

export interface ToraSubmission extends BaseEntity<number> { 
	id: number;
	attachment: string;
}
