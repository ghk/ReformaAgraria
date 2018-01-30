import { Component, OnInit, OnDestroy } from '@angular/core';
import { LibraryService } from '../services/library';
import { Library } from '../models/gen/library';
import { ToastrService } from "ngx-toastr";
import { saveAs as importedSaveAs } from "file-saver";
import { SharedService } from '../services/shared';
import { RegionService } from '../services/gen/region';

@Component({
    selector: 'ra-library',
    templateUrl: '../templates/library.html',
})
export class LibraryComponent implements OnInit, OnDestroy {
    library: Library[] = [];
    model: any = {};
    libraryId: number;

    constructor(        
        private toastr: ToastrService,
        private sharedService: SharedService,
        private regionService: RegionService,
        private libraryService: LibraryService        
    ) { }

    ngOnInit(): void {
        if (!this.sharedService.region) {
            this.regionService.getById('72.1').subscribe(region => {
                this.sharedService.setRegion(region);
            })
        };

        this.getAll();
    }

    ngOnDestroy(): void {

    }

    getAll() {
        let libraryQuery = {};
        this.libraryService.getAll(libraryQuery, null).subscribe(data => {
            this.library = data;
        })
    }

    upload() {
        this.libraryService.upload(this.model, null).subscribe(
            data => {
                this.toastr.success('Upload berhasil', null);
                this.getAll();
            },
            error => {
                this.toastr.error('Upload gagal', null);
            });
    }

    onChangeFile(event) {
        this.model['file'] = event.srcElement.files;
    }

    delete(id) {
        this.libraryId = id;
    }

    deleteLibrary() {
        this.libraryService.delete(this.libraryId)
            .subscribe(
            data => {
                this.toastr.success('Data berhasil dihapus', null);
                this.getAll();
                (<any>$('#deleteModal')).modal('hide');
            },
            error => {
                this.toastr.error(error, null);
            });
    }

    onDownload(id, title, extension) {
        var link = [window.location.origin, 'library', id + "_" + title + extension].join("/")
        $("#download").attr("href", link);
        $('#download')[0].click();
    }
}