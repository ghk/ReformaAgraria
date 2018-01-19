import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { getISOWeek } from 'date-fns';
import { DatePipe } from '@angular/common';

export class CustomDateFormatter extends CalendarDateFormatter {
    public weekViewTitle({ date, locale }: DateFormatterParams): string {
        const year: string = new DatePipe(locale).transform(date, 'y');
        const weekNumber: number = getISOWeek(date);
        return `Minggu ${weekNumber} di ${year}`;
    }
}
