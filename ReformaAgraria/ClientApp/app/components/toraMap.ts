import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { Region } from "../models/gen/region";
import { ToraMap } from '../models/gen/toraMap';

import { SharedService } from '../services/shared';
import { RegionService } from '../services/gen/region';
import { ToraMapService } from '../services/gen/toraMap';
import { ToraObjectService } from '../services/gen/toraObject';
import { BaseLayerService } from "../services/gen/baseLayer";

import * as L from 'leaflet';

import { ModalToraMapUploadFormComponent } from './modals/toraMapUploadForm';
import { ModalToraMapDownloadFormComponent } from './modals/toraMapDownloadForm';

const LAYERS = {
    "OpenStreetMap": new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    "OpenTopoMap": new L.TileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'),
    "ESRIImagery": new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
    'MapboxSatellite': new L.TileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2hrIiwiYSI6ImUxYmUxZDU3MTllY2ZkMGQ3OTAwNTg1MmNlMWUyYWIyIn0.qZKc1XfW236NeD0qAKBf9A')
};

@Component({
    selector: 'ra-tora-map',
    templateUrl: '../templates/toraMap.html',
})
export class ToraMapComponent implements OnInit, OnDestroy {
    downloadModalRef: BsModalRef;
    uploadModalRef: BsModalRef;

    subscription: Subscription;
    toraMapSubscription: Subscription;

    region: Region;

    map: L.Map;
    options: any;
    center: any;
    zoom: number;
    layersControl: any = {};   
    layers: L.Layer[] = [];  
    
    toraMaps: ToraMap[] = [];

    constructor(
        private toastr: ToastrService,
        private modalService: BsModalService,
        private sharedService: SharedService,
        private toraMapService: ToraMapService,
        private baseLayerService: BaseLayerService
    ) { }

    ngOnInit(): void {     
        this.center = L.latLng(-1.374581, 119.977618);
        this.zoom = 10;
        this.options = {
            zoomControl: false,
            layers: [LAYERS["OpenStreetMap"]]
        };
        
        this.subscription = this.sharedService.getRegion().subscribe(region => {
            this.region = region;

            let baseLayerQuery = {};
            this.baseLayerService.getAll(baseLayerQuery, null).subscribe(base => {
                this.applyOverlayBaseLayer(base);
            });                    
            
            let toraMapQuery = { data: { 'type': 'getAllByRegionComplete', 'regionId': region.id } }
            this.toraMapService.getAll(toraMapQuery, null).subscribe(data => {
                this.applyOverlayTora(data);
            });     
        });

        this.toraMapSubscription = this.sharedService.getToraMapReloadedStatus().subscribe(r => {
            if (!r) 
                return;

            let toraMapQuery = { data: { 'type': 'getAllByRegionComplete', 'regionId': this.region.id } }
            this.toraMapService.getAll(toraMapQuery, null).subscribe(data => {
                this.applyOverlayTora(data);
                this.sharedService.setToraMapReloadedStatus(false);
            }); 
        })
    }

    ngOnDestroy(): void {
        this.map.remove();
        this.subscription.unsubscribe();
        this.toraMapSubscription.unsubscribe();
    }    

    getToraMaps(region: Region) {
        let query = { data: { 'type': 'getAllByRegion', 'regionId': region.id } }
        this.toraMapService.getAll(query, null).subscribe(data => {
            this.toraMaps = data;
        });     
    }     

    setupControlBar() {
        L.control.zoom({
            position: 'bottomright'
        }).addTo(this.map);

        let downloadButton = L.Control.extend({
            options: { position: 'topleft' },
            onAdd: (map: L.Map) => {
                let div = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');
                div.innerHTML = `
                    <button type="button" class="btn btn-outline-secondary btn-sm" style="width:44px; height:44px;">
                        <i class="fa fa-download fa-2x"></i>
                    </button>
                `;                
                div.onclick = (e) => { 
                    this.onShowDownloadForm();
                };
                return div;
            }
        });
        this.map.addControl(new downloadButton());

        let uploadButton = L.Control.extend({
            options: { position: 'topleft' },
            onAdd: (map: L.Map) => {
                let div = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');
                div.innerHTML = `
                    <button type="button" class="btn btn-outline-secondary btn-sm" style="width:44px; height:44px;">
                        <i class="fa fa-upload fa-2x"></i>
                    </button>                    
                `;                
                div.onclick = (e) => { 
                    this.onShowUploadForm();
                };
                return div;
            }
        });
        this.map.addControl(new uploadButton());        
    }  

    onShowDownloadForm(): void {
        this.modalService.show(ModalToraMapDownloadFormComponent);
    }

    onShowUploadForm(): void {
        this.modalService.show(ModalToraMapUploadFormComponent);
    }

    onMapReady(map: L.Map): void {
        this.map = map;
        this.setupControlBar();       
    }

    getGeoJsonTora(data: ToraMap, currentColor): any {
        var size = data.toraObject.size ? (data.toraObject.size / 10000).toFixed(2) + ' ha' : '-';
        var totalSubjects = data.toraObject.totalSubjects || '-';

        let geoJsonOptions = {
            style: (feature) => {
                let color = "#000";
                if (color !== "" && color) {
                    color = currentColor;
                }
                return { color: color, weight: feature.geometry.type === 'LineString' ? 3 : 1 }
            },     
            onEachFeature: (feature, layer: L.FeatureGroup) => {
                layer.bindPopup('<table class=\'table table-sm\'><thead><tr><th colspan=3 style=\'text-align:center\'><a href="/toradetail/' + data.toraObject.id + '">' + data.name + '</th></tr></thead>' +
                    '<tbody><tr><td>Kabupaten</td><td>:</td><td><a href="/home/' + data.region.parent.parent.id.split('.').join('_') + '">' + data.region.parent.parent.name + '</a></td></tr>' +
                    '<tr><td>Kecamatan</td><td>:</td><td><a href="/home/' + data.region.parent.id.split('.').join('_') + '">' + data.region.parent.name + '</td></tr>' +
                    '<tr><td>Desa</td><td>:</td><td><a href="/home/' + data.region.id.split('.').join('_') + '">' + data.region.name + '</td></tr>' +
                    '<tr><td>Luas</td><td>:</td><td>' + size + '</td></tr>' +
                    '<tr><td>Jumlah Penggarap</td><td>:</td><td>' + totalSubjects + '</td></tr></tbody></table>');       
            }
        };      

        return L.geoJSON(JSON.parse(data.geojson), geoJsonOptions);
    } 

    getGeoJsonBaseLayer(geoJson, currentColor): L.GeoJSON {
        let geoJsonOptions = {
            style: (feature) => {
                let color = "#000";
                if (color !== "" && color) {
                    color = currentColor;
                }
                return { color: color, weight: feature.geometry.type === 'LineString' ? 3 : 1 }
            },          
            onEachFeature: (feature, layer: L.FeatureGroup) => {               
            }
        };
        return L.geoJSON(geoJson, geoJsonOptions);
    }

    applyOverlayTora(data) {
        this.layers.length = 0;
        data.forEach(result => {
            let geojson = this.getGeoJsonTora(result, '#FF0000');
            this.layers.push(geojson);
        });
    }

    applyOverlayBaseLayer(data) {
        this.layersControl['overlays'] = {};
        data.forEach(result => {         
            let geojson = this.getGeoJsonBaseLayer(JSON.parse(result.geojson), result.color);
            this.layersControl.overlays[result.label] = geojson;
        });
    }       
}