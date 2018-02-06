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
import { SearchViewModel } from '../models/gen/searchViewModel';
import { EventType } from "../models/gen/eventType";
import { Query } from '../models/query';

import * as moment from 'moment';

import * as $ from 'jquery';

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
    attachment: any;
    photos: any[] = [];
    loading: boolean = true;
    dataSource: any;

    eventModalRef: BsModalRef;

    openModalWindow: boolean = false;
    imagePointer: number = 0;

    openModalWindowObservable: boolean = false;
    imagePointerObservable: number = 0;
    image: Image;
    imagesArray: Array<Image> = [];
    images: Observable<Array<Image>> = Observable.of(this.imagesArray).delay(300);
    imagesArraySubscribed: Array<Image>;
    subscription: Subscription;
    imagesArraySubscription: Subscription;

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
        this.subscriptions.push(this.route.params.subscribe(params => {
            let eventId: number = params['id'];
            this.getData(eventId);
            this.dataSource = Observable.create((observer: any) => { observer.next(this.selected); })
                .switchMap((keywords: string) => this.searchService.searchRegion(keywords))
                .catch((error: any) => { console.log(error); return []; });
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.imagesArraySubscription) {
            this.imagesArraySubscription.unsubscribe();
        }
    }

    openImageModalObservable(image: Image) {
        this.subscription = this.images.subscribe((val: Image[]) => {
            this.imagePointerObservable = val.indexOf(image);
            this.openModalWindowObservable = true;
        });
    }

    onImageLoaded(event: ImageModalEvent) {
        // angular-modal-gallery will emit this event if it will load successfully input images
        console.log('onImageLoaded action: ' + Action[event.action]);
        console.log('onImageLoaded result:' + event.result);
    }

    onVisibleIndex(event: ImageModalEvent) {
        console.log('action: ' + Action[event.action]);
        console.log('result:' + event.result);
    }

    onIsFirstImage(event: ImageModalEvent) {
        console.log('onfirst action: ' + Action[event.action]);
        console.log('onfirst result:' + event.result);
    }

    onIsLastImage(event: ImageModalEvent) {
        console.log('onlast action: ' + Action[event.action]);
        console.log('onlast result:' + event.result);
    }

    onCloseImageModal(event: ImageModalEvent) {
        console.log('onClose action: ' + Action[event.action]);
        console.log('onClose result:' + event.result);
        this.openModalWindow = false;
        this.openModalWindowObservable = false;
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
                let eventTypeQuery: Query = { data: { 'type': 'getAllByRegionType', 'regionType': 2 } };
                this.eventTypeService.getAll(eventTypeQuery, null).subscribe(eventTypes => {
                    this.eventTypes = eventTypes;
                    this.loading = false;
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
        this.eventService.getDocumentsName(eventId.toString(), 'attachment', this.progressListener.bind(this))
            .subscribe(
            data => {
                this.attachments = data;
            });
    }

    getPhotos(eventId) {
        this.eventService.getDocumentsName(eventId.toString(), 'photos', this.progressListener.bind(this))
            .subscribe(
            data => {
                this.photos = data;
                if (this.photos != null) {
                    this.imagesArray.length = 0;
                    for (var i = 0; i < this.photos.length; i++) {
                        this.image = new Image(
                            '/event/' + eventId + '/photos/' + this.photos[i],
                            '/event/' + eventId + '/photos/' + this.photos[i],
                            this.photos[i],
                            null
                        )
                        this.imagesArray.push(this.image);
                    }
                }
                this.imagesArraySubscription = Observable.of(null).delay(500).subscribe(() => {
                    this.imagesArraySubscribed = this.imagesArray;
                });
            });

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

    onDownload(id, title, extension) {
        var link = [window.location.origin, 'library', id + "_" + title + extension].join("/")
        $("#download").attr("href", link);
        $('#download')[0].click();
    }
}