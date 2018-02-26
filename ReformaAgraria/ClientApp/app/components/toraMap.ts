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
import { BaseLayer } from '../models/gen/baseLayer';
import { FeatureCollection, GeometryObject } from 'geojson';
import { MapHelper } from '../helpers/map';

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
            layers: [LAYERS['OpenStreetMap']]
        };
        this.layersControl.baseLayers = LAYERS;
        
        let baseLayerQuery = { data: { type: 'getAllWithoutGeojson' } };
        this.baseLayerService.getAll(baseLayerQuery, null).subscribe(base => {
            this.applyOverlayBaseLayer(base);
        });    

        this.subscription = this.sharedService.getRegion().subscribe(region => {
            this.region = region;
            this.getToraMaps(); 
        });

        this.toraMapSubscription = this.sharedService.getReloadToraMap().subscribe(reload => {
            if (!reload) return;
            this.getToraMaps();
        });
    }

    ngOnDestroy(): void {
        this.map.remove();
        this.subscription.unsubscribe();
        this.toraMapSubscription.unsubscribe();
    }        

    getToraMaps(): void {
        let toraMapQuery = { data: { 'type': 'getAllByRegionComplete', 'regionId': this.region.id } }
        this.toraMapService.getAll(toraMapQuery, null).subscribe(data => {
            this.applyOverlayTora(data);
        }); 
    }
    
    onMapReady(map: L.Map): void {
        this.map = map;
        this.setupControlBar();       
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
    
    applyOverlayTora(toraMaps: ToraMap[]) {
        this.layers.length = 0;
        toraMaps.forEach(toraMap => {
            let geojson = MapHelper.getGeojsonToraMap(toraMap, '#FF0000');
            this.layers.push(geojson);
        });
    }

    applyOverlayBaseLayer(baseLayers: BaseLayer[]) {
        for (var key in this.layersControl.overlays)
            this.map.removeLayer(this.layersControl.overlays[key]);
        this.layersControl.overlays = {};

        baseLayers.forEach(baseLayer => {         
            let geojson = MapHelper.getGeojsonBaseLayer(baseLayer, this.baseLayerService);
            this.layersControl.overlays[baseLayer.label] = geojson;
        });
    }      
    
    onShowDownloadForm(): void {
        this.modalService.show(ModalToraMapDownloadFormComponent);
    }

    onShowUploadForm(): void {
        this.modalService.show(ModalToraMapUploadFormComponent);
    }
}