import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RegionType } from '../models/gen/regionType';
import { RegionService } from '../services/gen/region';
import { AgrariaIssuesListService } from '../services/agrariaIssuesList';
import { SharedService } from '../services/shared';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'ra-region',
    templateUrl: '../templates/region.html'
})
export class RegionComponent implements OnInit {
    regions: any = [];
    region: string = 'Lokasi';
    id: string;
    parentId: string;
    model: any = {};
    breadcrumbs: any = [];
    showDiv: boolean = true;
    loading: boolean = false;
    showPage: boolean = true;
    orderBy: string = "region.name";
    isDesc: boolean = false;
    prevColumn: string = "";

    constructor(
        private regionService: RegionService,
        private cookieService: CookieService,
        private sharedService: SharedService,
        private agrariaIssuesListService: AgrariaIssuesListService
    ) { }

    ngOnInit() {
        this.loading = true;
        this.showPage = false;
        this.sharedService.getRegionId().subscribe(id =>
            this.regionService.getById(id).subscribe(data => {
                this.cookieService.set('regionId', data.id);
                this.cookieService.set('regionName', data.name);
                this.cookieService.set('fkParentId', data.fkParentId);
                if (data.type == RegionType.Desa) {
                    this.showDiv = false;
                    this.getRegionById(data.id, (data.type - 2), (data.type), data.fkParentId);
                    this.sharedService.setIsAgrariaIssuesListReloaded(true);
                    this.loading = false;
                    this.showPage = true;
                }
                else {
                    this.showDiv = true;
                    this.getRegionById(data.id, (data.type - 2), (data.type), data.fkParentId);
                    this.sharedService.setIsAgrariaIssuesListReloaded(false);
                    this.loading = false;
                    this.showPage = true;
                }
                
            })
        )
    };
    
    getRegion(regionType: RegionType, parentId: string) {
        let query = { data: { 'type': 'parent', 'regionType': regionType, 'parentId': parentId } }
        this.regionService.getAll(query, null).subscribe(data => {
            this.regions = data;
            this.region = RegionType[this.regions[0].region.type];
        });
    }

     getRegionById(id: string, depth: number, regionType: RegionType, parentId: string) {
         let query = { data: { 'type': 'breadcrumb', 'depth': depth } }
         this.regionService.getById(id, query).subscribe(region => {
             this.sharedService.setRegion(region); 
             if (regionType < 4) {
                 this.getToraObjectSummary(id);
             }
         })
    }

     getToraObjectSummary(id: string) {
         this.loading = true;
         this.showPage = false;
         this.agrariaIssuesListService.getToraObjectSummary(id).subscribe(data => {
             this.regions = data;
             this.region = RegionType[this.regions[0].region.type];
             this.loading = false;
             this.showPage = true;
         })
     }

     sorted(sortedBy: string) {
         if (sortedBy == "Total Objek") {
             this.orderBy = 'totalToraObjects';
         }
         else if (sortedBy == "Luas") {
             this.orderBy = 'totalSize';
         }
         else {
             this.orderBy = 'region.name';
         }

         if (this.prevColumn != this.orderBy) {
             this.isDesc = false;
         }
         else {
             if (this.isDesc == false) {
                 this.isDesc = true;
             }
             else {
                 this.isDesc = false;
             }
         }

         this.prevColumn = this.orderBy;
     }
}
