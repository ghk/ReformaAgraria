import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RegionType } from '../models/gen/regionType';
import { RegionService } from '../services/gen/region';
import { SharedService } from '../services/shared';

@Component({
    selector: 'ra-region',
    templateUrl: '../templates/region.html'
})
export class RegionComponent implements OnInit {
    regions: any = [];
    region: string;
    id: string;
    parentId: string;
    model: any = {};
    breadcrumbs: any = [];

    constructor(
        private regionService: RegionService,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        this.getRegion(RegionType.Kecamatan, '72.1');
    }

    clicked(id: string, regionType: RegionType, parentId: string) {
        this.getRegionById(id, (regionType - 2), (regionType), parentId);
    }

     getRegion(regionType: RegionType, parentId: string) {
        let query = { data: { 'type': 'parent', 'regionType': regionType, 'parentId': parentId } }
        console.log(query);
        this.regionService.getAll(query, null).subscribe(data => {
            this.regions = data;
            this.region = RegionType[this.regions[0].type];
        });
    }

     getRegionById(id: string, depth: number, regionType: RegionType, parentId: string) {
         let query = { data: { 'type': 'breadcrumb', 'depth': depth } }
         this.regionService.getById(id, query).subscribe(region => {
             this.sharedService.setRegion(region);
             this.getRegion((regionType + 1), id);
         })
     }
}
