import { Event } from './Event';
import { BaseEntity } from './BaseEntity';
import { MeetingAttendee } from "./MeetingAttendee";

export interface MeetingMinute extends BaseEntity<number> { 
	id: number;
	description: string;
	attachment: string;
	meetingAttendees: MeetingAttendee[];
	fkEventId: number;
	event: Event;
}
