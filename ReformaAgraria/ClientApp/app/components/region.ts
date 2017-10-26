import { Component, OnInit } from '@angular/core';
import { RegionType } from '../models/gen/regionType';
import { RegionService } from '../services/gen/region';

@Component({
    selector: 'ra-region',
    templateUrl: '../templates/region.html'
})
export class RegionComponent implements OnInit {
    regions: any = [];
    region: string;

    constructor(private regionService: RegionService) { }

    ngOnInit() {
        this.getRegion(RegionType.Kabupaten, null);
    }

    getRegion(regionType: RegionType, parentId: string) {
        let query = { data: { 'type': 'parent', 'regionType': regionType, 'parentId': parentId } }
        console.log(query);
        this.regionService.getAll(query, null).subscribe(data => { this.regions = data, this.region = RegionType[this.regions[0].type] });
    }
}
