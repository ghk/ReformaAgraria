import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapNavigationService } from '../services/mapNavigation';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'ra-map-navigation',
    templateUrl: '../templates/map-navigation.html',
})
export class MapNavigationComponent implements OnInit, OnDestroy {
    
    constructor(private mapNavigation: MapNavigationService, private toastr: ToastrService) { }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }
    
    uploadFile(event) {
        this.mapNavigation.import(event)
            .subscribe(
            data => {
                this.toastr.success('File is successfully uploaded', null)
            },
            error => {
                this.toastr.error('Unable to upload the file', null)
            });
    }

}