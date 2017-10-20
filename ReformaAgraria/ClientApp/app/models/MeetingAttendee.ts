import { BaseEntity } from './BaseEntity';

export interface MeetingAttendee extends BaseEntity<number> { 
	id: number;
	name: string;
}
