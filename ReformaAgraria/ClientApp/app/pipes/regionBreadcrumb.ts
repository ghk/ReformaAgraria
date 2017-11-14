import { Pipe, PipeTransform } from "@angular/core";
import { Region } from "../models/gen/region";

@Pipe({
    name: 'regionBreadcrumb',
    pure: true
})
export class RegionBreadcrumbPipe implements PipeTransform {

    transform(region: Region) {
        if (!region)
            return [];
        let result = this.traverse(region, []);
        return result.reverse();
    }
    
    traverse(region: Region, result: any[]): Region[] {
        result.push(region);
        if (region.parent)
            this.traverse(region.parent, result);
        return result;
    }
 }