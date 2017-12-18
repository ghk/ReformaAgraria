import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapNavigationService } from '../services/mapNavigation';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../services/shared';
import { Region } from "../models/gen/region";
import * as L from 'leaflet';
import * as $ from 'jquery';

import MapUtils from '../helpers/mapUtils';
const DATA_SOURCES = 'data';
const LAYERS = {
    "OpenStreetMap": new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    "OpenTopoMap": new L.TileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'),
    "ESRIImagery": new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
    'MapboxSatellite': new L.TileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2hrIiwiYSI6ImUxYmUxZDU3MTllY2ZkMGQ3OTAwNTg1MmNlMWUyYWIyIn0.qZKc1XfW236NeD0qAKBf9A')
};

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