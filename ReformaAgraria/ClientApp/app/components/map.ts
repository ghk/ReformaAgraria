import { OnInit, OnDestroy, Component, ApplicationRef, EventEmitter, Input, Output, Injector, ComponentRef, ComponentFactoryResolver } from "@angular/core";
import * as L from 'leaflet';
import * as $ from 'jquery';
import { BaseLayerService } from '../services/gen/baseLayer';
import { MapService } from '../services/map';
import { BaseLayer } from '../models/gen/baseLayer';
import MapUtils from '../helpers/mapUtils';


const DATA_SOURCES = 'data';
const LAYERS = {
    "OpenStreetMap": new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    "OpenTopoMap": new L.TileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'),
    "ESRIImagery": new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
    'MapboxSatellite': new L.TileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2hrIiwiYSI6ImUxYmUxZDU3MTllY2ZkMGQ3OTAwNTg1MmNlMWUyYWIyIn0.qZKc1XfW236NeD0qAKBf9A')
};

import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'ra-map',
    templateUrl: '../templates/map.html',
})
export class MapComponent implements OnInit, OnDestroy {    
    map: L.Map;
    snapShotMap: L.Map;
    geoJSONLayer: L.GeoJSON;
    options: any;
    drawOptions: any;
    center: any;
    zoom: number;    
    perkabigConfig: any;    
    isExportingMap: boolean;
    layers: any[] = [];
    layersControl: any;
    controlOverlayShowing: any;
    afterInit: boolean;
    mapData: any;
    baseLayers: any;
    overlays: L.Control.Layers;    
    model: any =  {};
    markers = [];
    initialData: any[] = [];
    isOverlayAdded: boolean;
    BaseLayer: BaseLayer;

    constructor(private baseLayerService: BaseLayerService, private mapService: MapService, private toastr: ToastrService) { }
    
    ngOnInit(): void {
        this.center = L.latLng(-1.374581, 119.977618);
        this.zoom = 10;
        this.options = {
            zoomControl: false,
            layers: [LAYERS["OpenStreetMap"]]
        };
        let query = {};
        this.baseLayerService.getAll(query, null).subscribe(data => {
            this.applyOverlay(data);
        });        
    }    

    ngOnDestroy() {
        this.map.remove();        
    }
     
    applyOverlay(data) {
        if (data.length && data.length == 0) {
            return
        }
        data.forEach(result => {
            let geojson = this.getGeoJson(JSON.parse(result.geojson), result.color);
            console.log(geojson._layers);
            let innerHtml = `<a href="javascript:void(0)">
                                    <span class="oi oi-x overlay-action" id="delete" style="float:right;" data-value="${result.id}"></span>
                                    </a>
                                <a href="javascript:void(0)" >
                                    <span class="oi oi-pencil overlay-action" id="edit" style="float:right;margin-right:10px" data-value="${result.id}"></span>
                                </a>
                                    `;
            let layer = this.overlays.addOverlay(geojson, `${result.label} ${innerHtml}`);
            this.layers.push({ id: result.id, layer: geojson });
            this.initialData.push(result);
        });
        this.isOverlayAdded = true;
    }


    onclickActionOverlay = (event) =>{
        $(`#${event.target.id}-modal`)['modal']("show");
        let id = event.target.dataset.value;
        let currentModel = this.initialData.find(o => o.id == parseInt(id));
        this.model = Object.assign({}, currentModel);
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
            let elemenets = $(".overlay-action");

            for (let i = 0; i < elemenets.length; i++) {
                let element = elemenets[i];

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
                position: 'bottomright'
            },
            onAdd: (map: L.Map) => {
                let div = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control fullscreen-button');
                div.innerHTML = '<a href="javascript:void(0);" style="color:black"><i class="oi oi-fullscreen-enter"></i></a>';                
                div.onclick = (e) => this.fullScreenToggle(e);
                return div;
            }
        });

        this.map.addControl(new button());

        button = L.Control.extend({
            options: {
                position: 'topleft'
            },
            onAdd: (map: L.Map) => {
                let div = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');
                div.innerHTML = '<button type="button" class="btn btn-light btn-sm">Upload File</button>';                
                div.onclick = (e) => $("#upload-modal")['modal']("show");
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
                div.innerHTML = `<button type="button" class="btn btn-light btn-sm" style="width: 232px; position: relative;">Kawasan Dan Perizinan</button>`;

                let buttonOverlay = div.getElementsByTagName('button')[0];
                buttonOverlay.onclick = (e) => this.toggleControlLayers(3);
                
                return div;
            }
        });
        this.map.addControl(new button());

        button = L.Control.extend({
            options: {
                position: 'topright'
            },
            onAdd: (map: L.Map) => {
                let div = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control control-right-2');
                div.innerHTML = `<button type="button" class="btn btn-light btn-sm" style="width: 214px; position: relative;">Base Layers</button>`;

                let buttonOverlay = div.getElementsByTagName('button')[0];
                buttonOverlay.onclick = (e) => this.toggleControlLayers(4);
                return div;
            }
        });

        this.map.addControl(new button());      
        this.overlays = L.control.layers(null, null, { collapsed: false }).addTo(this.map);
        this.baseLayers = L.control.layers(LAYERS, null, { collapsed: false }).addTo(this.map);        
        this.afterInit = true;
    }

    toggleControlLayers(id) {
        if (this.controlOverlayShowing) {
            if (this.controlOverlayShowing.id != id && this.controlOverlayShowing.status == '') {
                let element = $(`.leaflet-control-layers-expanded:nth-child(${this.controlOverlayShowing.id})`)[0];
                element.style.visibility == 'hidden';
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
        
    setLayer(name): void {
        let layer: L.Layer = LAYERS[name];
        layer.addTo(this.map);
        //LAYERS[name].addTo(this.map);
        //this.map.addLayer(LAYERS[name]);
    }

    removeLayer(id): void {
        let currentOverlay = this.layers.find(o => o.id == id);
        let currentData = this.initialData.find(o => o.id == id);
        
        this.overlays.removeLayer(currentOverlay.layer);
        this.layers.splice(currentOverlay, 1);
        this.initialData.splice(currentData, 1);
    }
      
    addMarker(marker): void {
        this.markers.push(marker);
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

    uploadFile() {
        $("#upload-modal")['modal']("hide");
        this.mapService.import(this.model)
            .subscribe(
            data => {
                this.toastr.success("Upload File Berhasil", null);
                this.applyOverlay([data]);
            });
    }

    editOverlay(model) {
        $("#edit-modal")['modal']("hide");
        
        this.mapService.edit(model).subscribe(data => {
            this.toastr.success("Pengeditan Berhasil", null);
            this.removeLayer(data.id);
            this.applyOverlay([data]);
        });
        
    }

    deleteOverlay(model) {
        $("#delete-modal")['modal']("hide");
        let baselayerModel: BaseLayer = model;

        this.baseLayerService.deleteById(model.id)
            .subscribe(result => {
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
                    fillColor: "red",
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
}