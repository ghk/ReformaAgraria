import { OnInit, OnDestroy, Component, ApplicationRef, EventEmitter, Input, Output, Injector, ComponentRef, ComponentFactoryResolver } from "@angular/core";
import * as L from 'leaflet';
import * as $ from 'jquery';
import { MapService } from '../services/mapService';

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
    layers: any;
    layersControl: any;
    controlOverlayShowing: any;
    afterInit: boolean;
    model = {};
    markers = [];

    constructor(private mapService: MapService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.center = L.latLng(-1.374581, 119.977618);
        this.zoom = 8;
        this.options = {
            layers: null,
            zoomControl: false           
        };
        
    }    

    ngOnDestroy() {

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
    
    setupControlBar() {
        L.control.zoom({
            position: 'bottomright'
        }).addTo(this.map);

        
        let buttonFullscreen = L.Control.extend({
            options: {
                position: 'bottomright'
            },
            onAdd: (map: L.Map) => {
                let div = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');
                div.innerHTML = '<a href="javascript:void(0);" style="color:black"><i class="oi oi-fullscreen-enter"></i></a>';
                div.style.width = '33px';
                div.style.height = '30px';
                div.style.textAlign = 'center';
                div.style.lineHeight = '30px';
                div.onclick = (e) => this.fullScreenToggle(e);
                return div;
            }
        });
        this.map.addControl(new buttonFullscreen());

        let buttonUploadDialog = L.Control.extend({
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
        this.map.addControl(new buttonUploadDialog());

        let buttonListSector1 = L.Control.extend({
            options: {
                position: 'topright'
            },
            onAdd: (map: L.Map) => {
                let div = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');
                div.innerHTML = `<button type="button" class="btn btn-light btn-sm">Kawasan Dan Perizinan</button>`;

                let buttonOverlay = div.getElementsByTagName('button')[0];
                buttonOverlay.onclick = (e) => this.toggleControlLayers(3);
                
                return div;
            }
        });
        this.map.addControl(new buttonListSector1());

        let buttonListSector2 = L.Control.extend({
            options: {
                position: 'topright'
            },
            onAdd: (map: L.Map) => {
                let div = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control control-2');
                div.innerHTML = `<button type="button" class="btn btn-light btn-sm">Wilayah Kelola</button>`;
                window['div'] = div;

                let buttonOverlay = div.getElementsByTagName('button')[0];
                buttonOverlay.onclick = (e) => this.toggleControlLayers(4);
                return div;
            }
        });
        this.map.addControl(new buttonListSector2());        
        L.control.layers(null, null,{ collapsed: false }).addTo(this.map);        
        L.control.layers(null, null, { collapsed: false }).addTo(this.map);
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
        console.log('clicked');
    }

    openUploadDialog() {

    }
    
    setLayer(name): void {
        this.map.addLayer(LAYERS[name]);
    }

    removeLayer(name): void {
        this.map.removeLayer(LAYERS[name]);
    }
      
    loadGeoJson(): void {
     
    }

    addMarker(marker): void {
        this.markers.push(marker);
    }

    clearMap() {
        this.geoJSONLayer ? this.map.removeLayer(this.geoJSONLayer) : null;                 
        for (let i = 0; i < this.markers.length; i++)
            this.map.removeLayer(this.markers[i]);

        this.markers = [];
    }

    onMapReady(map: L.Map): void {
        this.map = map;
        this.setLayer('OpenStreetMap');
        this.setupControlBar();

        this.map.setView(this.center, this.zoom, this.options);

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
                this.toastr.success('File is successfully uploaded', null)
            },
            error => {
                this.toastr.error('Unable to upload the file', null)
            });
    }

    onChangeFile(event) {        
        this.model['file'] = event.srcElement.files
    }
    
}