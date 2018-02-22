import { Component, OnInit, OnDestroy } from "@angular/core";
import { ToastrService } from 'ngx-toastr';

import { SharedService } from "../services/shared";
import { RegionService } from "../services/gen/region";
import { BaseLayerService } from '../services/gen/baseLayer';
import { ToraMapService } from "../services/gen/toraMap";
import { ToraObjectService } from "../services/gen/toraObject";

import { ToraMap } from "../models/gen/toraMap";
import { BaseLayer } from '../models/gen/baseLayer';
import { MapHelper } from '../helpers/map';

import * as L from 'leaflet';
import * as $ from 'jquery';
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ModalBaseLayerUploadFormComponent } from "./modals/baseLayerUploadForm";
import { ModalDeleteComponent } from "./modals/delete";
import { Subscription } from "rxjs";
import { UploadBaseLayerViewModel } from "../models/gen/uploadBaseLayerViewModel";

const DATA_SOURCES = 'data';
const LAYERS = {
    "OpenStreetMap": new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    "OpenTopoMap": new L.TileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'),
    "ESRIImagery": new L.TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
    'MapboxSatellite': new L.TileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2hrIiwiYSI6ImUxYmUxZDU3MTllY2ZkMGQ3OTAwNTg1MmNlMWUyYWIyIn0.qZKc1XfW236NeD0qAKBf9A')
};

@Component({
    selector: 'ra-map',
    templateUrl: '../templates/map.html'
})
export class MapComponent implements OnInit, OnDestroy {
    baseLayerUploadModalRef: BsModalRef;
    uploadSubscription: Subscription;
    deleteModalRef: BsModalRef;
    deleteSubscription: Subscription;

    map: L.Map;
    options: any;
    center: any;
    zoom: number;

    layersControl: any = {};
    layers: L.Layer[] = [];
    isOverlayAdded: boolean;

    constructor(
        private toastr: ToastrService,
        private modalService: BsModalService,
        private sharedService: SharedService,
        private baseLayerService: BaseLayerService,
        private toraMapService: ToraMapService,
        private regionService: RegionService
    ) { }

    ngOnInit(): void {
        if (!this.sharedService.region) {
            this.regionService.getById('72.1').subscribe(region => {
                this.sharedService.setRegion(region);
            });
        };

        this.center = L.latLng(-1.374581, 119.977618);
        this.zoom = 10;
        this.options = {
            zoomControl: false,
            layers: [LAYERS["OpenStreetMap"]]
        };
        this.layersControl.baseLayers = LAYERS;

        this.getBaseLayers();
        this.getToraMaps();
    }

    ngOnDestroy() {
        this.map.remove();
        if (this.deleteSubscription)
            this.deleteSubscription.unsubscribe();
        $('#map').off('click', '.overlay-action', this.onClickOverlayAction);
    }
    
    onMapReady(map: L.Map): void {
        this.map = map;
        this.setupControlBar();
        $('#map').on('click', '.overlay-action', this.onClickOverlayAction);
    }

    getBaseLayers(): void {
        let baseLayerQuery = { data: { type: 'getAllWithoutGeojson' } };
        this.baseLayerService.getAll(baseLayerQuery, null).subscribe(data => {
            this.applyBaseLayerOverlay(data);
        });
    }

    getToraMaps(): void {
        let toraMapQuery = { data: { 'type': 'getAllByRegionComplete', 'regionId': '72.1' } }
        this.toraMapService.getAll(toraMapQuery, null).subscribe(data => {
            this.applyToraOverlay(data);
        });        
    }

    applyBaseLayerOverlay(baseLayers: BaseLayer[]) {
        this.layersControl.overlays = {};
        baseLayers.forEach(baseLayer => {
            let geojson = MapHelper.getGeojsonBaseLayer(baseLayer, this.baseLayerService)
            let innerHTML = `
            <span>${baseLayer.label}</span>            
            <a href="#"><span class="oi oi-x overlay-action" id="delete" style="float:right; padding-right:10px;" data-id="${baseLayer.id}" data-label="${baseLayer.label}"></span></a>
            <a href="#"><span class="oi oi-pencil overlay-action" id="edit" style="float:right; margin-right:10px;" data-id="${baseLayer.id}" data-label="${baseLayer.label}"></span></a>
            `;
            this.layersControl.overlays[innerHTML] = geojson;
        });
    }

    applyToraOverlay(toraMaps: ToraMap[]): void {
        this.layers.length = 0;
        toraMaps.forEach(toraMap => {
            let geojson = MapHelper.getGeojsonToraMap(toraMap, '#FF0000');            
            this.layers.push(geojson);
        });
    }

    setupControlBar() {
        L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        let addBaseLayerButton = L.Control.extend({
            options: {
                position: 'topleft'
            },
            onAdd: (map: L.Map) => {
                let div = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');               
                div.innerHTML = `
                <button type="button" class="btn btn-outline-secondary btn-sm" style="width:44px; height:44px;">
                    <i class="fa fa-plus fa-2x"></i>
                </button>`
                div.onclick = (e) => { this.onShowUploadForm(null) };
                return div;
            }
        });

        this.map.addControl(new addBaseLayerButton());
    }

    onClickOverlayAction = (event) => {
        event.stopPropagation();
        let id = event.target['dataset'].id;
        let label = event.target['dataset'].label;
        let model = { id: id, label: label };
        if (event.target['id'] === 'edit')
            this.onShowUploadForm(model);
        if (event.target['id'] === 'delete')
            this.onDeleteBaseLayer(model);        
        return false;
    }

    onShowUploadForm(model: UploadBaseLayerViewModel) {
        this.baseLayerUploadModalRef = this.modalService.show(ModalBaseLayerUploadFormComponent, { 'class': 'modal-lg' });
        this.baseLayerUploadModalRef.content.setModel(model);
        if (!this.uploadSubscription)
            this.uploadSubscription = this.baseLayerUploadModalRef.content.isSaveSuccess$.subscribe(error => {
                if (!error) {
                    this.getBaseLayers();
                }
                this.uploadSubscription.unsubscribe();
                this.uploadSubscription = null;                
            });
    }

    onDeleteBaseLayer(model: UploadBaseLayerViewModel) {
        this.deleteModalRef = this.modalService.show(ModalDeleteComponent);
        this.deleteModalRef.content.setModel(model);
        this.deleteModalRef.content.setService(this.baseLayerService);
        this.deleteModalRef.content.setLabel(model.label);
        if (!this.deleteSubscription)
            this.deleteSubscription = this.deleteModalRef.content.isDeleteSuccess$.subscribe(error => {
                if (!error) {
                    this.getBaseLayers();
                }
                this.deleteSubscription.unsubscribe();
                this.deleteSubscription = null;
                this.deleteModalRef.hide();
            });
    }

}
