import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestOptions } from "@angular/http/http";

import { AgrariaIssuesListService } from '../services/agrariaIssuesList';

@Component({
    selector: 'ra-agraria-issues-list',
    templateUrl: '../templates/agraria-issues-list.html',
})
export class AgrariaIssuesListComponent implements OnInit, OnDestroy {
    issueLists: any = [];

    constructor(private agrariaIssuesList: AgrariaIssuesListService) { }

    ngOnInit(): void {
        this.getIssuesList('72.10.11.2006');
    }

    ngOnDestroy(): void {

    }

    fileChange(event) {
        this.agrariaIssuesList.import(event)
            .subscribe(
            data => console.log('success'),
            error => console.log(error)
            );
    }

    getIssuesList(id) {
        let query = { data: { 'type': 'getAllById', 'id': id } }
        this.agrariaIssuesList.getAll(query, null).subscribe(data => this.issueLists = data);
    }



}