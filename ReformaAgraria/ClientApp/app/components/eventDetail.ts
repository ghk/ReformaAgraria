import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { Subject, Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Progress } from "angular-progress-http";
import { Image, Action, ImageModalEvent, Description } from 'angular-modal-gallery';

import { SharedService } from '../services/shared';
import { RegionService } from '../services/gen/region';
import { EventService } from '../services/gen/event';
import { EventTypeService } from "../services/gen/eventType";
import { SearchService } from "../services/gen/search";

import { Event } from '../models/gen/event';
import { FormHelper } from '../helpers/form';
import { Region } from "../models/gen/region";
import { RegionType } from "../models/gen/regionType";
import { EventType } from "../models/gen/eventType";
import { Query } from '../models/query';

import { ModalEventFormComponent } from "./modals/eventForm";

import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
    selector: 'ra-event-detail',
    templateUrl: '../templates/eventDetail.html',
})
export class EventDetailComponent implements OnInit, OnDestroy {
    event: Event;
    region: Region;
    regionType: RegionType;
    progress: Progress;
    attachments: any[] = [];
    attachment: any;

    eventFormModalRef: BsModalRef;
    routeParamsSubscription: Subscription;
    eventFormSubscription: Subscription;

    isOpenGalleryModal: boolean = false;
    imagePointer: number = 0;    
    image: Image;
    images: Array<Image> = [];

    constructor(
        private toastr: ToastrService,
        private sharedService: SharedService,
        private regionService: RegionService,
        private eventService: EventService,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private eventTypeService: EventTypeService,
        private searchService: SearchService
    ) { }

    ngOnInit(): void {
        this.routeParamsSubscription = this.route.params.subscribe(params => {
            let eventId: number = params['id'];
            this.getData(eventId);
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }
    
    getData(id: number) {
        this.eventService.getById(id, null, null).subscribe(event => {
            this.event = event;
            this.event.startDate = moment.utc(this.event.startDate).local().toDate();
            this.event.endDate = moment.utc(this.event.endDate).local().toDate();
            this.getAttachment(id);
            this.getPhotos(id);
            this.regionService.getById(event.fkRegionId, null, null).subscribe(region => {
                this.region = region;
            });
        })
    }

    openGalleryModal(image: Image) {
        this.imagePointer = this.images.indexOf(image);
        this.isOpenGalleryModal = true;
    }

    onVisibleIndex(event: ImageModalEvent) {
        //console.log('action: ' + Action[event.action]);
        //console.log('result:' + event.result);
    }  

    onCloseImageModal(event: ImageModalEvent) {
        //console.log('onClose action: ' + Action[event.action]);
        //console.log('onClose result:' + event.result);
        this.isOpenGalleryModal = false;
    }

    onShowEventForm(): void {
        this.event.region = this.region;
        this.eventFormModalRef = this.modalService.show(ModalEventFormComponent, { 'class': 'modal-lg' });
        this.eventFormModalRef.content.setEvent(this.event);
        if (!this.eventFormSubscription)
            this.eventFormSubscription = this.eventFormModalRef.content.isSaveSuccess$.subscribe(error => {
                if (!error) {
                    this.getData(this.event.id);                    
                }
                this.eventFormSubscription.unsubscribe();
                this.eventFormSubscription = null;
                this.eventFormModalRef.hide();
            });
    }

    onChangeUpload(file: File, uploadType) {
        let formData = new FormData();
        formData.append('eventId', this.event.id.toString());
        formData.append('uploadType', uploadType);
        formData.append('file', file);

        this.eventService.upload(formData, this.progressListener.bind(this)).subscribe(
            data => {
                this.getAttachment(this.event.id);
                this.getPhotos(this.event.id);
                this.toastr.success('File berhasil diupload');
            },
            error => {
                this.toastr.error('Upload file gagal');
            }
        );
    }

    getAttachment(eventId) {
        this.eventService.getDocumentsNames(eventId.toString(), 'attachment', this.progressListener.bind(this)).subscribe(
            data => {
                this.attachments = data;
            }
        );
    }

    getPhotos(eventId) {
        this.eventService.getDocumentsNames(eventId, 'photos', this.progressListener.bind(this)).subscribe(
            data => {   
                if (!data || data.length === 0)
                    return;

                this.images.length = 0;
                for (var i = 0; i < data.length; i++) {
                    this.image = new Image(
                        '/event/' + eventId + '/photos/' + data[i],
                        '/event/' + eventId + '/photos/' + data[i],
                        data[i],
                        null
                    );
                    this.images.push(this.image);
                }                
            }
        );
    }

    download(fileName) {
        var link = [window.location.origin, 'event', this.event.id, 'attachment', fileName].join("/")
        $("#download").attr("href", link);
        $('#download')[0].click();
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }

    delete(attachment) {
        this.attachment = attachment;
    }

    deleteAttachment() {
        this.eventService.deleteAttachment(this.event.id.toString(), this.attachment)
            .subscribe(
            data => {
                this.toastr.success('data berhasil dihapus', null);
                this.getAttachment(this.event.id);
                (<any>$('#deletemodal')).modal('hide');
            },
            error => {
                this.toastr.error(error, null);
            });
    }    
}