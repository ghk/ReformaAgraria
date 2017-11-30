import { OnInit, OnDestroy, Component, ApplicationRef, EventEmitter, Input, Output, Injector, ComponentRef, ComponentFactoryResolver } from "@angular/core";
import * as L from 'leaflet';

const DATA_SOURCES = 'data';
const LAYERS = {
    "OpenStreetMap": new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    "OpenTopoMap": new L.TileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'),
    "ESRIImagery": new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
    'MapboxSatellite': new L.TileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2hrIiwiYSI6ImUxYmUxZDU3MTllY2ZkMGQ3OTAwNTg1MmNlMWUyYWIyIn0.qZKc1XfW236NeD0qAKBf9A')
};

class LegendControl extends L.Control {
    public features = null;
    public indicator = null;

    div = null;
    surfaces = null;

    constructor() {
        super();
       
    }

    updateFromData() {
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

    legendControl: LegendControl;

    constructor() { }

    ngOnInit(): void {
        this.isExportingMap = false;
        this.center = L.latLng(-6.174668, 106.827126);
        this.zoom = 14;
        this.options = {
            layers: null
        };
        this.drawOptions = {
            position: 'topright',
            draw: {
                marker: {
                    icon: L.icon({
                        iconUrl: '2273e3d8ad9264b7daa5bdbf8e6b47f8.png',
                        shadowUrl: '44a526eed258222515aa21eaffd14a96.png'
                    })
                },
                polyline: false,
                circle: {
                    shapeOptions: {
                        color: '#aaaaaa'
                    }
                }
            }
        };
    }

    ngOnDestroy() {

    }

    setMap(recenter = true): void {
        this.clearMap();
        this.loadGeoJson();

        try {
            if (recenter)
                this.map.setView(this.geoJSONLayer.getBounds().getCenter(), 14);
        }
        catch (error) {
            console.log('Something wrong with this geojson either the structure is error or null');
        }

        this.setupLegend();
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

    setupLegend(): void {
       
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
        //RESIZE ICON
        this.map.on('zoomend', () => {
            this.map.eachLayer(layer => {

            });
        });
    }
}