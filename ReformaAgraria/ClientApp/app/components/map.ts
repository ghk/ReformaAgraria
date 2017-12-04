import { OnInit, OnDestroy, Component, ApplicationRef, EventEmitter, Input, Output, Injector, ComponentRef, ComponentFactoryResolver } from "@angular/core";
import * as L from 'leaflet';

const DATA_SOURCES = 'data';
const LAYERS = {
    "OpenStreetMap": new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    "OpenTopoMap": new L.TileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'),
    "ESRIImagery": new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
    'MapboxSatellite': new L.TileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2hrIiwiYSI6ImUxYmUxZDU3MTllY2ZkMGQ3OTAwNTg1MmNlMWUyYWIyIn0.qZKc1XfW236NeD0qAKBf9A')
};

class RegionAndLicensingControl extends L.Control {
    div = null;

    constructor() {
        super();
        this.onAdd = (map: L.Map) => {
            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

            container.style.backgroundColor = 'white';
            container.style.backgroundImage = "url(https://t1.gstatic.com/images?q=tbn:ANd9GcR6FCUMW5bPn8C4PbKak2BJQQsmC-K9-mbYBeFZm1ZM2w2GRy40Ew)";
            container.style.backgroundSize = "30px 30px";
            container.style.width = '30px';
            container.style.height = '30px';

            container.onclick = function () {
                console.log('buttonClicked');
            }
            return container;
        };
    }    
}

@Component({
    selector: 'ra-map',
    templateUrl: '../templates/map.html',
})
export class MapComponent implements OnInit, OnDestroy {
    private _indicator: any;
    private _bigConfig: any;                          

    map: L.Map;
    snapShotMap: L.Map;
    options: any;
    drawOptions: any;
    center: any;
    zoom: number;
    geoJSONLayer: L.GeoJSON;
    smallSizeLayers: L.LayerGroup = L.layerGroup([]);
    mediumSizeLayers: L.LayerGroup = L.layerGroup([]);
    bigSizeLayers: L.LayerGroup = L.layerGroup([]);
    mapData: any;
    perkabigConfig: any;
    markers = [];
    isExportingMap: boolean;
    layers: any;
    layersControl: any;
    regionAndLicensingControl: RegionAndLicensingControl;

    constructor() { }

    ngOnInit(): void {
        this.center = L.latLng(-6.174668, 106.8271269);
        this.zoom = 5;
        this.options = {
            layers: null,
            zoomControl: false
            
        };
        
    }    

    ngOnDestroy() {

    }

    createControlBar() {
    }

    setupControlBar() {
        L.control.zoom({
            position: 'topright'
        }).addTo(this.map);

        /*
        let customControl = L.Control.extend({
            options: {
                position: 'topright'
            },
            onAdd: (map: L.Map) => {
                var container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');

                container.style.backgroundColor = 'white';
                container.style.backgroundImage = "url(https://t1.gstatic.com/images?q=tbn:ANd9GcR6FCUMW5bPn8C4PbKak2BJQQsmC-K9-mbYBeFZm1ZM2w2GRy40Ew)";
                container.style.backgroundSize = "30px 30px";
                container.style.width = '30px';
                container.style.height = '30px';

                container.onclick = function () {
                    console.log('buttonClicked');
                }

                return container;
            }
        });
        this.map.addControl(new customControl());
        */
    }

    setMap(recenter = true): void {
    }

    setMapData(data): void {
        this.mapData = data;
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
        

        //RESIZE ICON
        this.map.on('zoomend', () => {
            this.map.eachLayer(layer => {

            });
        });
    }
}