import { Component, OnInit, OnDestroy, ViewChild  } from '@angular/core';
import { MapComponent } from "./map";

@Component({
    selector: 'ra-map-navigation',
    templateUrl: '../templates/map-navigation.html',
})
export class MapNavigationComponent implements OnInit, OnDestroy {

    @ViewChild(MapComponent)
    private map: MapComponent

    viewMode: string;

    constructor() { }

    ngOnInit(): void {
        this.viewMode = 'map';
        this.map.setMap(true);
    }

    ngOnDestroy(): void {

    }

    uploadedFile(e) {
        console.log(e)

    }

}