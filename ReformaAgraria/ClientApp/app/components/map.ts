import { Component, OnInit, OnDestroy } from "@angular/core";
import { ColorPickerService } from 'angular4-color-picker';
import { ToastrService } from 'ngx-toastr';

import { SharedService } from "../services/shared";
import { BaseLayerService } from '../services/gen/baseLayer';
import { MapService } from '../services/map';
import { ToraMapService } from "../services/gen/toraMap";
import { ToraObjectService } from "../services/gen/toraObject";
import { RegionService } from "../services/gen/region";
import { ToraMap } from "../models/gen/toraMap";
import { BaseLayer } from '../models/gen/baseLayer';
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
    selector: 'ra-map',
    templateUrl: '../templates/map.html',
})
export class MapComponent implements OnInit, OnDestroy {
    map: L.Map;
    geoJSONLayer: L.GeoJSON;
    options: any;
    center: any;
    zoom: number;
    layers: any[] = [];
    controlOverlayShowing: any;
    afterInit: boolean;
    overlays: L.Control.Layers;
    model: any = {};
    markers = [];
    initialData: any[] = [];
    isOverlayAdded: boolean;

    private color: string = "#127bdc";

    constructor(
        private baseLayerService: BaseLayerService,
        private mapService: MapService,
        private toastr: ToastrService,
        private cpService: ColorPickerService,
        private sharedService: SharedService,
        private toraMapService: ToraMapService,
        private toraObjectService: ToraObjectService,
        private regionService: RegionService
    ) { }

    ngOnInit(): void {
        if (!this.sharedService.region) {
            this.regionService.getById('72.1').subscribe(region => {
                this.sharedService.setRegion(region);
            })
        };

        this.center = L.latLng(-1.374581, 119.977618);
        this.zoom = 10;
        this.options = {
            zoomControl: false,
            layers: [LAYERS["OpenStreetMap"]]
        };        
        
        window.addEventListener('resize', this.onResize);
        window.dispatchEvent(new Event('resize'));      

        let baseLayerQuery = {};
        this.baseLayerService.getAll(baseLayerQuery, null).subscribe(data => {
            this.applyOverlay(data);
        });

        let toraMapQuery = { data: { 'type': 'getAllByRegionComplete', 'regionId': '72.1' } }
        this.toraMapService.getAll(toraMapQuery, null).subscribe(data => {
            this.applyOverlayTora(data);
        });   

    }

    ngOnDestroy() {
        this.map.remove();
        window.removeEventListener('resize', this.onResize);
    }

    applyOverlay(data: BaseLayer[]) {   
        data.forEach(result => {
            let geojson = this.getGeoJson(JSON.parse(result.geojson), result.color);
            let innerHtml = `
            <a href="javascript:void(0)">
                <span class="oi oi-x overlay-action" id="delete" style="float:right; padding-right:10px;" data-value="${result.id}"></span>
            </a>
            <a href="javascript:void(0)">
                <span class="oi oi-pencil overlay-action" id="edit" style="float:right;margin-right:10px" data-value="${result.id}"></span>
            </a>                     
            `;            
            let layer = this.overlays.addOverlay(geojson, `${result.label} ${innerHtml}`);
            this.layers.push({ id: result.id, layer: geojson });
            this.initialData.push(result);
        });

        this.isOverlayAdded = true;
    }

    applyOverlayTora(data: ToraMap[]): void {
        data.forEach(result => {
            let geojson = this.getGeoJsonTora(result, '#FF0000');
        });
    }

    getGeoJsonTora(data: ToraMap, currentColor): any {
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
                    '<tbody><tr><td>Kabupaten</td><td>:</td><td>' + data.region.parent.parent.name + '</td></tr>' +
                    '<tr><td>Kecamatan</td><td>:</td><td>' + data.region.parent.name + '</td></tr>' +
                    '<tr><td>Desa</td><td>:</td><td>' + data.region.name + '</td></tr>' +
                    '<tr><td>Luas</td><td>:</td><td>' + data.toraObject.size + ' ha</td></tr>' +
                    '<tr><td>Jumlah Penduduk</td><td>:</td><td>' + data.toraObject.totalTenants + '</td></tr></tbody></table>');

                layer.on('click', function (e) {
                });

                layer.addTo(this.map);

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
        return L.geoJSON(JSON.parse(data.geojson), geoJsonOptions);
    } 

    onclickActionOverlay = (event) => {
        $(`#${event.target.id}-modal`)['modal']("show");

        let id = event.target.dataset.value;
        let currentModel = this.initialData.find(o => o.id == parseInt(id));

        this.model = Object.assign({}, currentModel);
        this.color = currentModel.color ? currentModel.color : this.color;
        if (event.target.id == "edit") {
            this.model["linkDownload"] = [window.location.origin, 'baseLayer', id + "_.zip"].join("/")
        }
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

        if (this.isOverlayAdded) {
            let elements = $(".overlay-action");
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];
                element.addEventListener('click', this.onclickActionOverlay, false);
            }
            this.isOverlayAdded = false;
        }
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
                div.innerHTML = `<button type="button"class="btn btn-outline-secondary btn-sm" style="height:35px;"><i class="material-icons">layers</i></button>`;

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

    setLayer(name): void {
        let layer: L.Layer = LAYERS[name];
        layer.addTo(this.map);
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

    addMarker(marker): void {
        this.markers.push(marker);
    }

    onMapReady(map: L.Map): void {
        this.map = map;
        this.setupControlBar();        
    }

    uploadFile() {
        $("#upload-modal")['modal']("hide");
        this.model['color'] = this.color;
        this.mapService.import(this.model)
            .subscribe(
            data => {
                this.toastr.success("Upload File Berhasil", null);
                this.applyOverlay([data]);
            });
    }

    editOverlay(model) {
        $("#edit-modal")['modal']("hide");
        this.model.color = this.color;

        this.mapService.import(model).subscribe(data => {
            this.toastr.success("Pengeditan Berhasil", null);
            this.removeLayer(data.id);
            this.applyOverlay([data]);
        });
    }

    deleteOverlay(model) {
        $("#delete-modal")['modal']("hide");
        let baselayerModel: BaseLayer = model;

        this.baseLayerService.deleteById(model.id.toString()).subscribe(result => {
            this.toastr.success("Penghapusan berhasil", null)
            this.removeLayer(model.id);
        })
    }

    onChangeFile(event) {
        this.model['file'] = event.srcElement.files;
    }

    setCenter(): void {
        if (!this.geoJSONLayer)
            this.setMap(true);
        else
            this.center = this.geoJSONLayer.getBounds().getCenter();
    }

    setMap(recenter = true): void {
        try {
            if (recenter)
                this.map.setView(this.geoJSONLayer.getBounds().getCenter(), 14);
        }
        catch (error) {
            console.log('Something wrong with this geojson either the structure is error or null');
        }
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
        return L.geoJSON(geoJson, geoJsonOptions);
    }

    onResize = (e) => {
        let height = e.target.innerHeight - 58;
        $("#map").height(height);
    }
}