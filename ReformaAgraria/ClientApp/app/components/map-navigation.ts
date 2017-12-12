import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapNavigationService } from '../services/mapNavigation';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../services/shared';
import { Region } from "../models/gen/region";

@Component({
    selector: 'ra-map-navigation',
    templateUrl: '../templates/map-navigation.html',
})
export class MapNavigationComponent implements OnInit, OnDestroy {
    region: Region;

    constructor(private mapNavigation: MapNavigationService,
        private toastr: ToastrService,
        private sharedService: SharedService) { }

    ngOnInit(): void {
        this.sharedService.getRegion().subscribe(region => this.region = region);
    }

    ngOnDestroy(): void {

    }
    
    uploadFile(event) {
        this.mapNavigation.import(event, this.region.name)
            .subscribe(
            data => {
                this.toastr.success('File is successfully uploaded', null)
            },
            error => {
                this.toastr.error('Unable to upload the file', null)
            });
    }

}