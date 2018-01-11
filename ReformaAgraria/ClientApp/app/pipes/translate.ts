import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'translate',
    pure: true
})
export class TranslatePipe implements PipeTransform {
    transform(value, args: string[]): any {
        switch(value) {
            case 'Government':
                return 'Pemerintah';
            default:
                return value;                
        }
    }
}