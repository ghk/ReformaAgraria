import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MapNavigationService } from '../services/mapNavigation';
import { SharedService } from '../services/shared';
import { RegionService } from '../services/gen/region';
import { ToraMapService } from '../services/gen/toraMap';
import { ToraObjectService } from '../services/gen/toraObject';
import { BaseLayerService } from "../services/gen/baseLayer";
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';

import { RegionType } from '../models/gen/regionType';
import { Region } from "../models/gen/region";
import { ToraMap } from '../models/gen/toraMap';
import { ToraObject } from '../models/gen/toraObject';
import { MapUtils } from '../helpers/mapUtils';

import * as L from 'leaflet';
import * as $ from 'jquery';

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
    geoJSONLayer: L.GeoJSON;
    options: any;
    center: any;
    zoom: number;
    layers: any[] = [];
    layersControl: any;
    controlOverlayShowing: any;
    afterInit: boolean;
    mapData: any;
    baseLayers: any;
    overlays: L.Control.Layers;    
    markers = [];
    leafletHeight: any;

    model: any = {};
    initialData: any[] = [];   
   
    container: any[] = [];
    kecamatanU: any[] = [];
    desaU: any[] = [];
    toU: any[] = [];
    kecamatanD: any[] = [];
    desaD: any[] = [];
    toD: any[] = [];    
    ToraMap: ToraMap;
    tora = [];
    ToraObject: ToraObject;
    uploadModel: any = {};
    downloadModel: any = {};

    subscription: Subscription;
    toraSubscription: Subscription;
    
    kecamatanList: Region[];
    desaList: Region[];
    toraObjectList: ToraObject[];
    toraMapList: ToraMap[];
    downloadLink: string;

    kabupaten: Region;
    kecamatan: Region;
    desa: Region;

    constructor(
        private mapNavigationService: MapNavigationService,
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
            let baseLayerQuery = {};
            this.baseLayerService.getAll(baseLayerQuery, null).subscribe(base => {
                this.applyOverlayBaseLayer(base);
            });

            if (this.container.length > 0) {
                this.container.forEach(result => {
                    this.map.removeLayer(result);
                });
                this.container = [];
            }
            
            this.region = region;
            this.getRegionList(this.region);
            let toraMapQuery = { data: { 'type': 'getAllByRegion', 'regionId': region.id } }
            this.toraMapService.getAll(toraMapQuery, null).subscribe(data => {
                this.applyOverlayTora(data);
            });     
        });
    }

    ngOnDestroy(): void {
        this.map.remove();
        this.subscription.unsubscribe();
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

    onUploadFormSubmit() {
        $("#upload-modal")['modal']("hide");
        this.mapNavigationService.import(this.uploadModel)
            .subscribe(data => {
                this.toastr.success("Upload File Berhasil", null);
                this.applyOverlayTora([data]);
                this.clearModal();
            });
    }

    onDownloadFormSubmit() {
        this.mapNavigationService.download(this.downloadModel.tora.id).subscribe(data => {
            let blob = new Blob([data.blob()], { type: 'application/zip' });
            saveAs(blob, this.downloadModel.tora.id + '.zip');
        });
    }

    onChangeFile(event) {
        this.uploadModel.file = event.srcElement.files;
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

    setLayer(name): void {
        let layer: L.Layer = LAYERS[name];
        layer.addTo(this.map);
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
                div.innerHTML = '<button type="button" class="btn btn-outline-secondary btn-sm" style="height:35px;"><strong><i class="material-icons">library_add</i></strong></button>';
                div.onclick = (e) => { 
                    this.clearModal();
                    $("#upload-modal")['modal']("show");
                };
                return div;
            }
        });
        this.map.addControl(new button());

        button = L.Control.extend({
            options: {
                position: 'topright'
            },
            onAdd: (map: L.Map) => {
                let div = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control control-right-1');
                div.innerHTML = `<button id="btn-layer" type="button"class="btn btn-outline-secondary btn-sm" style="height:35px;"><i class="material-icons">layers</i></button>`;

                let buttonOverlay = div.getElementsByTagName('button')[0];
                buttonOverlay.onclick = (e) => this.toggleControlLayers(2);

                return div;
            }
        });
        this.map.addControl(new button());

        this.overlays = L.control.layers(LAYERS, null, { collapsed: false }).addTo(this.map);
        this.afterInit = true;
    }

    ngAfterViewChecked() {
        if (this.afterInit) {
            let elements = $(`.leaflet-control-layers-expanded`)
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];
                element.style.visibility = 'hidden';
            }
            this.afterInit = false;
        }
    }

    toggleControlLayers(id) {
        if (this.controlOverlayShowing) {
            if (this.controlOverlayShowing.id != id && this.controlOverlayShowing.status === '') {
                let element = $(`.leaflet-control-layers-expanded:nth-child(${this.controlOverlayShowing.id})`)[0];
                element.style.visibility = 'hidden';
            }
        }

        let status = '';
        let element = $(`.leaflet-control-layers-expanded:nth-child(${id})`)[0];
        if (element) {
            status = element.style.visibility === 'hidden' ? '' : 'hidden';
            element.style.visibility = status;
        }
        this.controlOverlayShowing = { id: id, status: status }
    }
        
    onMapReady(map: L.Map): void {
        this.map = map;
        this.setLayer('OpenStreetMap');
        this.setupControlBar();

        //RESIZE ICON
        this.map.on('zoomend', () => {
            this.map.eachLayer(layer => {
            });
        });
    }

    getGeoJsonTora(data, currentColor, tora): any {
        this.regionService.getById(tora.fkRegionId, null, null).subscribe(desa => {
            this.desa = desa;
            this.regionService.getById(this.desa.fkParentId, null, null).subscribe(kecamatan => {
                this.kecamatan = kecamatan;
                this.regionService.getById(this.kecamatan.fkParentId, null, null).subscribe(kabupaten => {
                    this.kabupaten = kabupaten;
                    let geoJsonOptions = {
                        style: (feature) => {
                            let color = "#000";
                            if (color !== "" && color) {
                                color = currentColor;
                            }
                            return { color: color, weight: feature.geometry.type === 'LineString' ? 3 : 1 }
                        },
                        pointToLayer: (feature, latlng) => {
                            return new L.CircleMarker(latlng, {
                                radius: 8,
                                fillColor: "#000",
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.8
                            });
                        },
                        onEachFeature: (feature, layer: L.FeatureGroup) => {
                            layer.bindPopup('<table class=\'table table-sm\'><thead><tr><th colspan=3 style=\'text-align:center\'>' + data.name + '</th></tr></thead>' +
                                '<tbody><tr><td>Kabupaten</td><td>:</td><td>' + this.kabupaten.name + '</td></tr>' +
                                '<tr><td>Kecamatan</td><td>:</td><td>' + this.kecamatan.name + '</td></tr>' +
                                '<tr><td>Desa</td><td>:</td><td>' + this.desa.name + '</td></tr>' +
                                '<tr><td>Luas</td><td>:</td><td>' + tora.size + ' ha</td></tr>' +
                                '<tr><td>Jumlah Penduduk</td><td>:</td><td>' + tora.totalTenants + '</td></tr></tbody></table>');
            
                            layer.on('click', function (e) {
                            });
            
                            layer.addTo(this.map);
                            this.container.push(layer);
            
                            let center = null;
            
                            if (layer.feature['geometry'].type === 'Point') {
                                center = layer.feature['geometry'].coordinates;
                            }
                            else {
                                let bounds = layer.getBounds();
                                center = bounds.getCenter();
                            }
            
                            let element = null;
            
                            if (!element)
                                return;
            
                            if (feature.properties['icon']) {
                                let icon = L.icon({
                                    iconUrl: 'assets/markers/' + feature.properties['icon'],
                                    iconSize: [15, 15],
                                    shadowSize: [50, 64],
                                    iconAnchor: [22, 24],
                                    shadowAnchor: [4, 62],
                                    popupAnchor: [-3, -76]
                                });
            
                                let marker = L.marker(center, { icon: icon }).addTo(this.map);
                                this.addMarker(marker);
                            }
                        }
                    };
                    return MapUtils.setGeoJsonLayer(JSON.parse(data.geojson), geoJsonOptions);
                });
            });
        });
    } 

    getGeoJsonBaseLayer(geoJson, currentColor): any {
        let geoJsonOptions = {
            style: (feature) => {
                let color = "#000";
                if (color !== "" && color) {
                    color = currentColor;
                }
                return { color: color, weight: feature.geometry.type === 'LineString' ? 3 : 1 }
            },
            pointToLayer: (feature, latlng) => {
                return new L.CircleMarker(latlng, {
                    radius: 8,
                    fillColor: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: (feature, layer: L.FeatureGroup) => {
                let center = null;

                if (layer.feature['geometry'].type === 'Point') {
                    center = layer.feature['geometry'].coordinates;
                }
                else {
                    let bounds = layer.getBounds();
                    center = bounds.getCenter();
                }

                let element = null;

                if (!element)
                    return;

                if (feature.properties['icon']) {
                    let icon = L.icon({
                        iconUrl: 'assets/markers/' + feature.properties['icon'],
                        iconSize: [15, 15],
                        shadowSize: [50, 64],
                        iconAnchor: [22, 24],
                        shadowAnchor: [4, 62],
                        popupAnchor: [-3, -76]
                    });

                    let marker = L.marker(center, { icon: icon }).addTo(this.map);
                    this.addMarker(marker);
                }
            }
        };
        return MapUtils.setGeoJsonLayer(geoJson, geoJsonOptions);
    }

    addMarker(marker): void {
        this.markers.push(marker);
    }

    applyOverlayTora(data) {
        if (data.length && data.length == 0) {
            return;
        }
        data.forEach(result => {
            this.toraObjectService.getById(result.fkToraObjectId).subscribe(tora =>
            {
                let geojson = this.getGeoJsonTora(result, '#FF0000', tora);
            })
        });
    }

    applyOverlayBaseLayer(data) {
        if (data.length && data.length == 0) {
            return
        }

        data.forEach(result => {
            
            let geojson = this.getGeoJsonBaseLayer(JSON.parse(result.geojson), result.color);
            let layer = this.overlays.addOverlay(geojson, `${result.label}`);
            this.layers.push({ id: result.id, layer: geojson });
            this.initialData.push(result);
        });
    }

    deleteOverlay(model) {
        $("#delete-modal")['modal']("hide");
        let toraMapModel: ToraMap = model;

        this.toraMapService.deleteById(model.id).subscribe(result => {
            this.toastr.success("Penghapusan berhasil", null)
            this.removeLayer(model.id);
        })
    }

    removeLayer(id): void {
        let currentOverlay = this.layers.find(o => o.id == id);
        let currentData = this.initialData.find(o => o.id == id);

        this.overlays.removeLayer(currentOverlay.layer);
        this.map.removeLayer(currentOverlay.layer);
        this.layers.splice(currentOverlay, 1);
        this.initialData.splice(currentData, 1);
    } 

    
}