import { Component, OnInit } from '@angular/core';
import { RegionService } from '../services/gen/region';

@Component({
    selector: 'ra-region',
    templateUrl: '../templates/region.html'
})
export class RegionComponent implements OnInit {
    regions: any = [];
    region: string;

    constructor( private regionService: RegionService ) { }

    ngOnInit() {
        this.getRegion('2', null);
    }

    getRegion(regionType: string, parent: string) {
        this.regionService.Get(regionType, parent).subscribe(data => this.regions = data);
        this.region = this.regions[0].type;
    }
}
