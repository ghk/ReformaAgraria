import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../services/data';

@Component({
    selector: 'ra-village',
    templateUrl: '../templates/village.html',
})
export class VillageComponent implements OnInit, OnDestroy {

    constructor(
        private _dataService: DataService
    ) { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

}