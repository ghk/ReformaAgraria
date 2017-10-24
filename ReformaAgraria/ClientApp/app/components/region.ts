import { Component, OnInit } from '@angular/core';
import { RegionService } from '../services/region';
import { Region } from '../models/gen/region';

@Component({
    selector: 'ra-region',
    templateUrl: '../templates/region.html'
})

export class RegionComponent implements OnInit {
    model: any = {};

    constructor( private _regionService: RegionService ) { }

    ngOnInit() {
        this.getRegion();
    }

    getRegion(): void {
        this._regionService.getRegion("1").subscribe(data => this.model = data as Region);
    }
}
