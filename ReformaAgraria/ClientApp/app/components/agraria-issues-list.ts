import { Component, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';

@Component({
    selector: 'ra-agraria-issues-list',
    templateUrl: '../templates/agraria-issues-list.html',
})
export class AgrariaIssuesListComponent implements OnInit, OnDestroy {

    constructor() { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {

    }

    onToggle(id){
        let img = $("#"+id+" img");
        if(img.hasClass("spin-icon")){
            img.removeClass("spin-icon");
            img.addClass("back-spin");
        } else {
            img.removeClass("back-spin");
            img.addClass("spin-icon");
        }

    }

}