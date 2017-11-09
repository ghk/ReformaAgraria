import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RegionType } from '../models/gen/regionType';
import { RegionService } from '../services/gen/region';
import { SharedService } from '../services/shared';
import { CookieService } from 'ngx-cookie-service';

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
    showDiv: boolean = true;

    constructor(
        private regionService: RegionService,
        private cookieService: CookieService,
        private sharedService: SharedService,
    ) { }

    ngOnInit() {
        this.sharedService.getRegionId().subscribe(id =>
            this.regionService.getById(id).subscribe(data => {
                this.cookieService.set('regionId', data.id);
                this.cookieService.set('regionName', data.name);
                this.cookieService.set('fkParentId', data.fkParentId);
                if (data.type == RegionType.Desa) {
                    this.showDiv = false;
                    this.getRegionById(data.id, (data.type - 2), (data.type), data.fkParentId);
                    this.sharedService.setIsAgrariaIssuesListReloaded(true);
                }
                else {
                    this.showDiv = true;
                    this.getRegionById(data.id, (data.type - 2), (data.type), data.fkParentId);
                    this.sharedService.setIsAgrariaIssuesListReloaded(false);
                }
                
            })
        )
    };
    
     getRegion(regionType: RegionType, parentId: string) {
        let query = { data: { 'type': 'parent', 'regionType': regionType, 'parentId': parentId } }
        this.regionService.getAll(query, null).subscribe(data => {
            this.regions = data;
            this.region = RegionType[this.regions[0].type];
        });
    }

     getRegionById(id: string, depth: number, regionType: RegionType, parentId: string) {
         let query = { data: { 'type': 'breadcrumb', 'depth': depth } }
         this.regionService.getById(id, query).subscribe(region => {
             this.sharedService.setRegion(region); 
             if (regionType < 4) {
                 this.getRegion((regionType + 1), id);
             }
         })
     }


}
