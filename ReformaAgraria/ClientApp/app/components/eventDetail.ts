import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { Subject, Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Progress } from "angular-progress-http";

import { SharedService } from '../services/shared';
import { RegionService } from '../services/gen/region';
import { EventService } from '../services/gen/event';
import { EventTypeService } from "../services/gen/eventType";

import { Event } from '../models/gen/event';
import { FormHelper } from '../helpers/form';
import { Region } from "../models/gen/region";
import { RegionType } from "../models/gen/regionType";
import { SearchViewModel } from '../models/gen/searchViewModel';
import { EventType } from "../models/gen/eventType";
import { Query } from '../models/query';

import * as moment from 'moment';

@Component({
    selector: 'ra-event-detail',
    templateUrl: '../templates/eventDetail.html',
})
export class EventDetailComponent implements OnInit, OnDestroy {
    @ViewChild('eventModal') eventModal: TemplateRef<any>;

    event: Event;
    subscriptions: Subscription[] = [];
    region: Region;
    regionType: RegionType;
    eventTypes: EventType[];
    selected: any;
    progress: Progress;
    attachments: any[] = [];
    photos: any[] = [];

    eventModalRef: BsModalRef;

    constructor(        
        private toastr: ToastrService,
        private sharedService: SharedService,
        private regionService: RegionService,
        private eventService: EventService,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private eventTypeService: EventTypeService
    ) { }

    ngOnInit(): void {
        this.subscriptions.push(this.route.params.subscribe(params => {
            let eventId: number = params['id'];
            this.getData(eventId);
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getData(id: number) {
        this.eventService.getById(id, null, null).subscribe(event => {
            this.event = event;
            this.getAttachment(id);
            this.getPhotos(id);
            this.regionService.getById(event.fkRegionId, null, null).subscribe(region => {
                this.region = region;
                let eventTypeQuery: Query = { data: { 'type': 'getAllByRegionType', 'regionType': 2 } };
                this.eventTypeService.getAll(eventTypeQuery, null).subscribe(eventTypes => {
                    this.eventTypes = eventTypes;
                });
            });
        })
    }

    onUpdateEvent(): void {
        this.selected = this.region.name;
        this.eventModalRef = this.modalService.show(this.eventModal, { class: 'modal-lg' });
    }

    onSaveEvent(): void {
        this.eventService.update(this.event, null).subscribe(
            result => {
                this.resetEvent();
                this.eventModalRef.hide();
                this.toastr.success("Event berhasil disimpan");
                this.getData(this.event.id);
            },
            error => {
                this.eventModalRef.hide();
                this.toastr.error("Ada kesalahan dalam penyimpanan");
            }
        );
    }

    onChangeUpload(file: File, uploadType) {
        let formData = new FormData();
        formData.append('eventId', this.event.id.toString());
        formData.append('uploadType', uploadType);
        formData.append('file', file);

        this.eventService.upload(formData, this.progressListener.bind(this))
            .subscribe(
            data => {
                console.log('sukses');
                this.toastr.success('File berhasil diupload');
            },
            error => {
                this.toastr.error('Upload file gagal');
                console.log('gagal');
            }
            );
    }

    getAttachment(eventId) {
        this.eventService.getDocumentsName(eventId.toString(), 'attachment', this.progressListener.bind(this))
            .subscribe(
            data => {
                this.attachments = data;
            });
    }

    getPhotos(eventId) {
        //this.eventService.getDocumentsName(eventId.toString(), 'photos', this.progressListener.bind(this))
        //    .subscribe(
        //    data => {
        //        this.photos = data;
        //        for (var i = 0; i < this.photos.length; i++) {
        //            this.photos[i] = '../../../wwwroot/event/' + eventId + '/photos/' + this.photos[i];
        //        }
        //        console.log(this.photos);
        //    });
    }

    download(fileName) {
        var link = [window.location.origin, 'event', this.event.id, 'attachment', fileName].join("/")
        $("#download").attr("href", link);
        $('#download')[0].click();
    }
    
    progressListener(progress: Progress) {
        this.progress = progress;
    }

    onSearchSelected(model: any) {
        let svm: SearchViewModel = model.item;
        this.event.fkRegionId = svm.value;
    }

    resetEvent(): void {
        let event: Event = {
            startDate: null,
            endDate: null,
            description: null,
            resultDescription: null,
            attendees: null,
            fkRegionId: null,
            fkEventTypeId: null
        };

        this.event = event;
    }
    

    delete() {
        //this.libraryId = id;
    }

    deleteLibrary() {
        //this.libraryService.delete(this.libraryId)
        //    .subscribe(
        //    data => {
        //        this.toastr.success('Data berhasil dihapus', null);
        //        this.getAll();
        //        (<any>$('#deleteModal')).modal('hide');
        //    },
        //    error => {
        //        this.toastr.error(error, null);
        //    });
    }

    onDownload(id, title, extension) {
        var link = [window.location.origin, 'library', id + "_" + title + extension].join("/")
        $("#download").attr("href", link);
        $('#download')[0].click();        
    }
}