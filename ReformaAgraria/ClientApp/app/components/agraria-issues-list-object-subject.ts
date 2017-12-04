import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../services/data';

@Component({
    selector: 'ra-agraria-issues-list-object-subject',
    templateUrl: '../templates/agraria-issues-list-object-subject.html',
})
export class AgrariaIssuesListObjectSubjectComponent implements OnInit, OnDestroy {

    constructor(
        private _dataService: DataService
    ) { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

}