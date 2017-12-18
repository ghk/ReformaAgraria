import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from './../services/shared';
import { ProgressHttp } from 'angular-progress-http';
import { ToraObject } from './../models/gen/toraObject';

import 'rxjs/add/operator/map'
import * as urljoin from 'url-join';
import MapUtils from '../helpers/mapUtils';

import * as L from 'leaflet';
import * as $ from 'jquery';

import { RequestHelper } from '../helpers/request';
import { Query } from "../models/query";

const DATA_SOURCES = 'data';
const LAYERS = {
    "OpenStreetMap": new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    "OpenTopoMap": new L.TileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'),
    "ESRIImagery": new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
    'MapboxSatellite': new L.TileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2hrIiwiYSI6ImUxYmUxZDU3MTllY2ZkMGQ3OTAwNTg1MmNlMWUyYWIyIn0.qZKc1XfW236NeD0qAKBf9A')
};


@Injectable()
export class MapNavigationService {
    private serverUrl: string;
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

    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private sharedService: SharedService
    ) {
        this.serverUrl = this.sharedService.getEnvironment().serverUrl;
    }

    ngOnInit(): void {
        this.center = L.latLng(-1.374581, 119.977618);
        this.zoom = 10;
        this.options = {
            zoomControl: false,
            layers: [LAYERS["OpenStreetMap"]]
        };
    }    

    ngOnDestroy() {
        this.map.remove();
    }

    import(event, toraName) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            formData.append('toraName', toraName);
            let headers = new Headers();
            headers.append('Accept', 'application/json');
            let requestOptions = new RequestOptions({ headers: headers });
            return this.http.post('/api/villagemapattribute/import', formData, requestOptions)
                .map(res => res.json())
        }
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
                div.innerHTML = '<button type="button" class="btn btn-outline-dark btn-sm" style="font-size:22px; width:35px;"><strong>+</strong></button>';
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
                div.innerHTML = `<button type="button" class="btn btn-light btn-sm" style="width: auto; position: relative;">Kawasan Dan Perizinan</button>`;

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
    
    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            try {
                var body = error.json() || '';
                var err = null;
                if (body.message != undefined) {
                    err = body.message;
                    //errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
                }
                else if (body.description != undefined) {
                    err = body.description;
                }
                else {
                    err = JSON.stringify(body);
                }
                errMsg = `${err}`;
            } catch (e) {
                errMsg = `Unable to perform this request`;
            }
        } else {
            errMsg = 'Unable to perform this request';
        }
        return Observable.throw(errMsg);
    }
}