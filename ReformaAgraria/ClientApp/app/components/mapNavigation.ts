import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapNavigationService } from '../services/mapNavigation';
import { RegionType } from '../models/gen/regionType';
import { RegionService } from '../services/gen/region';
import { ToraMapService } from '../services/gen/toraMap';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../services/shared';
import { Region } from "../models/gen/region";
import MapUtils from '../helpers/mapUtils';
import { ToraMap } from '../models/gen/toraMap';
import { Subscription } from 'rxjs';

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
    selector: 'ra-map-navigation',
    templateUrl: '../templates/mapNavigation.html',
})
export class MapNavigationComponent implements OnInit, OnDestroy {
    region: Region;
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
    model: any = {};
    markers = [];
    initialData: any[] = [];
    isOverlayAdded: boolean;
    leafletHeight: any;
    kecUpload: string = 'kecamatan';
    desaUpload: string = 'desa';
    kecDownload: string = 'kecamatan';
    desaDownload: string = 'desa';
    kecamatanU: any[] = [];
    desaU: any[] = [];
    kecamatanD: any[] = [];
    desaD: any[] = [];
    ToraMap: ToraMap;
    tora = [];
    subscription: Subscription;

    

    constructor(private mapNavigationService: MapNavigationService,
        private toastr: ToastrService,
        private sharedService: SharedService,
        private regionService: RegionService,
        private toraMapService: ToraMapService) { }

    ngOnInit(): void {
        this.getRegion(3, '72.1', "all");
        this.center = L.latLng(-1.374581, 119.977618);
        this.zoom = 10;
        this.options = {
            zoomControl: false,
            layers: [LAYERS["OpenStreetMap"]]
        };
        this.subscription = this.sharedService.getRegionId().subscribe(id => {
            console.log(id);
            let query = { data: { 'type': 'parent', 'parentId': id } }
            this.toraMapService.getAll(query, null).subscribe(data => {
                this.applyOverlay(data);
            });     
        });
    }

    ngOnDestroy(): void {
        this.map.remove();
        this.subscription.unsubscribe();
    }

    onChangeUpload(value, region, parentId) {
        console.log(value);
        console.log(parentId);
        console.log(region);
        if (region == 'kecamatan') {
            this.kecUpload = value;
            console.log(this.kecUpload);
            this.desaUpload = 'desa';
            if (value != 'kecamatan') {
                this.getRegion(4, parentId, "upload");
            }
        }
        else {
            this.desaUpload = value;
            this.model.regionId = parentId;
            this.model.regionName = value;
        }
    }
    
    onChangeDownload(value, region, parentId) {
        console.log(value);
        console.log(parentId);
        console.log(region);
        if (region == 'kecamatan') {
            this.kecDownload = value;
            console.log(this.kecDownload);
            this.desaDownload = 'desa';
            if (value != 'kecamatan') {
                this.getRegion(4, parentId, "download");
            }
        }
        else if ((region == 'desa')) {
            this.desaDownload = value;
        }
        else {
            this.getToraMapList();
            this.model.toraId = value;
            this.model.regionName = this.desaDownload;
            this.model["linkDownload"] = [window.location.origin, 'TORA', this.model.regionName, this.model.toraId + "_.zip"].join("/");
        }
    }

    clearModal() {
        this.kecUpload = 'kecamatan';
        this.desaUpload = 'desa';
        this.kecDownload = 'kecamatan';
        this.desaDownload = 'desa';
        this.model.name = '';
    }

    getToraMapList() {
        this.tora = [];
        let query = { data: { 'type': 'parent', 'parentId': this.sharedService.getRegionId() } }
        this.toraMapService.getAll(query, null).subscribe(data => {
            data.forEach(result => { this.tora.push(`${result.name}`) })
        });     
    }

    setLayer(name): void {
        let layer: L.Layer = LAYERS[name];
        layer.addTo(this.map);
    }

    getRegion(regionType: RegionType, parentId: string, uploadDownload: string) {
        let query = { data: { 'type': 'parent', 'regionType': regionType, 'parentId': parentId } }
        this.regionService.getAll(query, null).subscribe(data => {
            if (uploadDownload == "upload") {
                if (regionType == 3) {
                    this.kecamatanU = data;
                }
                else {
                    this.desaU = data;
                }
            }
            else if (uploadDownload == "download") {
                if (regionType == 3) {
                    this.kecamatanD = data;
                }
                else {
                    this.desaD = data;
                }
            }
            else {
                this.kecamatanU = data;
                this.kecamatanD = data;
            }
        });
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
                div.onclick = (e) => { this.model = {}; $("#form-upload")[0]["reset"](); $("#upload-modal")['modal']("show") };
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

    fullScreenToggle(e) {
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

    getGeoJson(geoJson, currentColor): any {
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


    applyOverlay(data) {
        if (data.length && data.length == 0) {
            return
        }
        data.forEach(result => {
            let geojson = this.getGeoJson(JSON.parse(result.geojson), result.color);
            let innerHtml = `<a href="javascript:void(0)">
                                    <span class="oi oi-x overlay-action" id="delete" style="float:right;" data-value="${result.id}"></span>
                                    </a>
                                    `;
            let layer = this.overlays.addOverlay(geojson, `${result.name} ${innerHtml}`);
            this.tora = [];
            this.tora.push(`${result.name}`);
            this.layers.push({ id: result.id, layer: geojson });
            this.initialData.push(result);
        });
        this.isOverlayAdded = true;
        $("input.leaflet-control-layers-selector:checkbox").click();
        $("#btn-layer").click();
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
        this.isOverlayAdded = true;
    }

    onChangeFile(event) {
        this.model['file'] = event.srcElement.files;
    }

    uploadFile() {
        $("#upload-modal")['modal']("hide");
        this.mapNavigationService.import(this.model)
            .subscribe(
            data => {
                this.toastr.success("Upload File Berhasil", null);
                this.applyOverlay([data]);
                this.clearModal();
            });
    }
}