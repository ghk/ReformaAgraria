import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../services/data';

@Component({
    selector: 'ra-event',
    templateUrl: '../templates/event.html',
})
export class EventComponent implements OnInit, OnDestroy {

    constructor(
        private _dataService: DataService
    ) { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

}