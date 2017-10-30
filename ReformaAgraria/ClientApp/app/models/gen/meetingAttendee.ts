import { BaseEntity } from './baseEntity';

export interface MeetingAttendee extends BaseEntity<number> { 
    id: number;
    name: string;
}
