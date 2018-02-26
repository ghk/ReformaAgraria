import { Pipe, PipeTransform } from "@angular/core";
import { EventType } from "../models/gen/eventType";
import { Region } from "../models/gen/region";

@Pipe({
    name: 'eventType',
    pure: true
})
export class EventTypePipe implements PipeTransform {
    transform(items: EventType[], region: Region): EventType[] {
        if (!items || items.length === 0 || !region)
            return items;
        return items.filter(item => item.regionType == region.type);
    }
}