import { Component } from '@angular/core';
import { Region } from '../../models/gen/region';
import { RegionService } from '../../services/gen/region';
import { CrudComponent } from './crud';

@Component({
    selector: 'ra-region',
    templateUrl: '../../templates/crud/region.html'
})
export class RegionCrudComponent extends CrudComponent<Region, string> {

    constructor(private regionService: RegionService) { 
        super(regionService);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
