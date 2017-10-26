import { Component, OnInit } from '@angular/core';
import { Region } from '../models/gen/region';
import { RegionService } from '../services/gen/region';

@Component({
    selector: 'ra-region',
    templateUrl: '../templates/region.html'
})
export class RegionComponent implements OnInit {
    model: any = {};

    constructor( private regionService: RegionService ) { }

    ngOnInit() {
        this.getRegion();
    }

    getRegion(): void {
        this.regionService.getById('1', null).subscribe(data => this.model = data as Region);
    }
}
