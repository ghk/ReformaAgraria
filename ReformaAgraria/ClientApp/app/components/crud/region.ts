import { Component } from '@angular/core';
import { Region } from '../../models/gen/region';
import { RegionType } from '../../models/gen/regionType';
import { RegionService } from '../../services/gen/region';
import { CrudComponent } from './crud';

@Component({
    selector: 'ra-region',
    templateUrl: '../../templates/crud/region.html'
})
export class RegionCrudComponent extends CrudComponent<Region, string> {

    regionTypes: any = RegionType;

    constructor(private regionService: RegionService) { 
        super(regionService);
    }

    ngOnInit(): void {        
        this.resetModel();
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    toggleForm(show: boolean): void {
        this.resetModel();
        this.formMessage = null;
        this.showForm = show;        
    }

    resetModel(): void {
        this.model = {
            id: null,
            name: null,
            isKelurahan: false,
            fkParentId: null,
            type: null
        }
    }

}
