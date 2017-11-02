import { MeetingAttendee } from './meetingAttendee';
import { Event } from './event';
import { BaseEntity } from './baseEntity';

export interface MeetingMinute extends BaseEntity<number> { 
    id: number;
    description: string;
    attachment: string;
    meetingAttendees: MeetingAttendee[];
    fkEventId: number;
    event?: Event;
}
