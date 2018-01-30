import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { saveAs } from "file-saver";

import { SharedService } from '../services/shared';
import { RegionService } from '../services/gen/region';
import { LibraryService } from '../services/gen/library';

import { Library } from '../models/gen/library';
import { UploadLibraryViewModel } from '../models/gen/uploadLibraryViewModel';
import { FormHelper } from '../helpers/form';

@Component({
    selector: 'ra-library',
    templateUrl: '../templates/library.html',
})
export class LibraryComponent implements OnInit, OnDestroy {
    library: Library[] = [];
    model: UploadLibraryViewModel = {};
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
        let formData = FormHelper.serialize(this.model);
        this.libraryService.upload(formData, null).subscribe(
            data => {
                this.toastr.success('Upload berhasil', null);
                this.getAll();
            },
            error => {
                this.toastr.error('Upload gagal', null);
            });
    }

    onChangeFile(file: File) {
        this.model.file = file;
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