import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';

import { SharedService } from '../services/shared';
import { RegionService } from '../services/gen/region';
import { ToraMapService } from '../services/gen/toraMap';
import { ToraObjectService } from '../services/gen/toraObject';
import { BaseLayerService } from "../services/gen/baseLayer";

import { RegionType } from '../models/gen/regionType';
import { Region } from "../models/gen/region";
import { ToraMap } from '../models/gen/toraMap';
import { ToraObject } from '../models/gen/toraObject';
import { MapUtils } from '../helpers/mapUtils';

import * as L from 'leaflet';
import * as $ from 'jquery';
import { geoJSON } from 'leaflet';

const DATA_SOURCES = 'data';
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
    region: Region;
    RegionType = RegionType;

    map: L.Map;
    options: any;
    center: any;
    zoom: number;
    controlOverlayShowing: any;
    afterInit: boolean;
    overlays: L.Control.Layers;   
    layersControl: any ;   
    layers: L.Layer[] = [];  
    tora = [];
    uploadModel: any = {};
    downloadModel: any = {};

    subscription: Subscription;
    toraMapSubscription: Subscription;
    
    kecamatanList: Region[];
    desaList: Region[];
    toraObjectList: ToraObject[];
    toraMapList: ToraMap[];

    kabupaten: Region;
    kecamatan: Region;
    desa: Region;

    constructor(
        private toastr: ToastrService,
        private sharedService: SharedService,
        private regionService: RegionService,
        private toraMapService: ToraMapService,
        private toraObjectService: ToraObjectService,
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
            this.resetMap();

            let baseLayerQuery = {};
            this.baseLayerService.getAll(baseLayerQuery, null).subscribe(base => {
                this.applyOverlayBaseLayer(base);
            });
                    
            this.region = region;
            this.getRegionList(this.region);
            let toraMapQuery = { data: { 'type': 'getAllByRegionComplete', 'regionId': region.id } }
            this.toraMapService.getAll(toraMapQuery, null).subscribe(data => {
                this.applyOverlayTora(data);
            });     
        });

        this.toraMapSubscription = this.sharedService.getToraMapReloadedStatus().subscribe(r => {
            if (r = true) {
                let toraMapQuery = { data: { 'type': 'getAllByRegionComplete', 'regionId': this.region.id } }
                this.toraMapService.getAll(toraMapQuery, null).subscribe(data => {
                    this.applyOverlayTora(data);
                    this.sharedService.setToraMapReloadedStatus(false);
                }); 
            }    
        })
    }

    ngOnDestroy(): void {
        this.map.remove();
        this.subscription.unsubscribe();
        this.toraMapSubscription.unsubscribe();
    }

    getRegionList(region: Region) {
        if (region.type === RegionType.Desa) {      
            this.desaList = [region];  
            this.regionService.getById(region.fkParentId, null, null).subscribe(region => {
                this.kecamatanList = [region];                     
            });
        }

        if (region.type === RegionType.Kecamatan) {            
            this.kecamatanList = [region];
            let desaQuery = { data: { 'type': 'getAllByParent', 'parentId': region.id } };
            this.regionService.getAll(desaQuery, null).subscribe(regions => {
                this.desaList = regions;                
            });
        }  

        if (region.type === RegionType.Kabupaten) {
            let kecamatanQuery = { data: { 'type': 'getAllByParent', 'parentId': region.id } };
            this.regionService.getAll(kecamatanQuery, null).subscribe(regions => {
                this.kecamatanList = regions;                
            });
        }
    }

    getDesaList(region: Region) {
        let desaQuery = { data: { 'type': 'getAllByParent', 'parentId': region.id } }; 
        this.regionService.getAll(desaQuery, null).subscribe(regions => {
            this.desaList = regions;
        })
    }

    getToraObjectList(region: Region) {
        let query = { data: { 'type': 'getAllByRegion', 'regionId': region.id } }
        this.toraObjectService.getAll(query, null).subscribe(data => {
            this.toraObjectList = data;
        });
    }

    getToraMapList(region: Region) {
        let query = { data: { 'type': 'getAllByRegion', 'regionId': region.id } }
        this.toraMapService.getAll(query, null).subscribe(data => {
            this.toraMapList = data;
        });     
    }

    onUploadFormChange(region: Region, type: string): void {     
        if (type === 'kecamatan') { 
            this.uploadModel.desa = null;                        
            if (region)
                this.getDesaList(region);
        }
        if (region && type === 'desa') {
            this.getToraObjectList(region);
        }
        this.uploadModel.tora = null;
        this.uploadModel.file = null;
    } 
    
    onDownloadFormChange(region: Region, type: string): void {
        if (type === 'kecamatan') {
            this.downloadModel.desa = null;
            if (region)
                this.getDesaList(region);
        }
        if (region && type === 'desa') {            
            this.getToraMapList(region);
        }
        this.downloadModel.tora = null;
    }    

    onSubmitUploadForm() {
        $("#upload-modal")['modal']("hide");        
        
        let formData = new FormData();
        formData.append("toraObjectId", this.uploadModel.tora.id);
        formData.append("toraObjectName", this.uploadModel.tora.name);
        formData.append("regionId", this.uploadModel.desa.id);
        formData.append("file", this.uploadModel.file);

        this.toraMapService.upload(formData).subscribe(
            data => {
                this.toastr.success("Upload File Berhasil", null);
                let toraMapQuery = { data: { 'type': 'getAllByRegionComplete', 'regionId': this.region.id } }
                this.toraMapService.getAll(toraMapQuery, null).subscribe(data => {
                    this.applyOverlayTora(data);
                });   
                this.clearModal();
            },
            error => {
                this.toastr.error("Ada kesalahan dalam upload", null);
            }
        );
    }

    onSubmitDownloadForm() {
        this.toraMapService.download(this.downloadModel.tora.id.toString(), 'toramapid').subscribe(data => {
            let blob = new Blob([data.blob()], { type: 'application/zip' });
            saveAs(blob, this.downloadModel.tora.id + '.zip');
        });
    }

    onSelectFile(file: File) {
        this.uploadModel.file = file;
    }
   
    clearModal() {      
        let kecamatan = null;
        let desa = null;        
        
        if (this.region.type === RegionType.Kecamatan) {            
            kecamatan = this.region;
        }
        if (this.region.type === RegionType.Desa) {
            kecamatan = this.kecamatanList.find(r => r.id === this.region.fkParentId);
            desa = this.region;
            if (!this.toraObjectList)
                this.getToraObjectList(this.region);
            if (!this.toraMapList)
                this.getToraMapList(this.region);
        }

        this.uploadModel = {
            kecamatan: kecamatan,
            desa: desa,
            tora: null
        };
        this.downloadModel = {
            kecamatan: kecamatan,
            desa: desa,
            tora: null
        };
    }

    resetMap(): void {
        this.layersControl = {
            baseLayers: LAYERS,
            overlays: {}
        };

        this.layers.forEach(layer => {
            layer.removeFrom(this.map);
        })
    }
    
    setupControlBar() {
        L.control.zoom({
            position: 'bottomright'
        }).addTo(this.map);

        let button = L.Control.extend({
            options: {
                position: 'topleft'
            },
            onAdd: (map: L.Map) => {
                let div = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');
                div.innerHTML = '<button type="button" class="btn btn-outline-secondary btn-sm" style="width:44px; height:44px; padding-top: 0.5rem"><strong><i class="material-icons">library_add</i></strong></button>';
                div.onclick = (e) => { 
                    this.clearModal();
                    $("#upload-modal")['modal']("show");
                };
                return div;
            }
        });
        this.map.addControl(new button());
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
        data.forEach(result => {
            let geojson = this.getGeoJsonTora(result, '#FF0000');
            this.layers.push(geojson);
        });
    }

    applyOverlayBaseLayer(data) {
        data.forEach(result => {         
            let geojson = this.getGeoJsonBaseLayer(JSON.parse(result.geojson), result.color);
            this.layersControl.overlays[result.label] = geojson;
        });
    }       
}