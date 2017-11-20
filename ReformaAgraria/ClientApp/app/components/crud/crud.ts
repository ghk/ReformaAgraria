import { OnInit, OnDestroy } from '@angular/core';
import { Progress } from 'angular-progress-http';

import { Query } from '../../models/query';
import { CookieService } from 'ngx-cookie-service';
import { CrudService } from '../../services/crud';

export class CrudComponent<TModel, TId> implements OnInit, OnDestroy {

    isReadOnly: boolean = true;
    service: CrudService<TModel, TId>;
    model: TModel;
    entities: Array<TModel> = [];
    query: Query = {
        page: 1,
        perPage: 20,
        sort: 'id',
        keywords: ''
    };
    progress: Progress;
    showForm: boolean = false;
    formMessage: {
        'type': string,
        'message': string,
        'errors': any
    } = {
        'type': '',
        'message': '',
        'errors': ''
    };

    constructor(service: CrudService<TModel, TId>) {
        this.service = service;
        if (this.service.createOrUpdate)
            this.isReadOnly = false;
    }

    ngOnInit(): void {
        this.getAll(this.query);
    }
    
    ngOnDestroy(): void {

    }

    getAll(query: Query): void {
        this.service.getAll(query, this.progressListener.bind(this))
            .subscribe(
            result => {
                this.entities = result;
            },
            error => {
                this.formMessage.type = 'error';
                this.formMessage.message = error;
                this.formMessage.errors = "";
            }
            );
    }

    edit(model: TModel): void {
        this.toggleForm(true);
        this.model = model;
        scrollTo(0, 0);
    }

    createOrUpdate(): void {
        this.service.createOrUpdate(this.model, this.progressListener.bind(this))
            .subscribe(
            result => {
                this.formMessage.type = 'success';
                this.formMessage.message = 'Successfully Saved!';
            },
            error => {
                this.formMessage.type = 'error';
                this.formMessage.message = error;
                this.formMessage.errors = "";
            },
            () => {
                this.getAll(this.query);
            }
            );
    }

    search(): void {
        if (!this.query.keywords)
            this.query.keywords = '';
        else if (this.query.keywords.length < 3)
            return;
        this.getAll(this.query);
    }

    goToPage(page: number): void {
        if (this.query.page == page)
            return;

        this.query.page = page;
        this.getAll(this.query);
    }

    reset(): void {
        this.query.page = 1;
        this.query.sort = 'id';
        this.query.keywords = '';
        this.getAll(this.query);
    }

    toggleForm(show: boolean): void {        
        this.showForm = show;
    }

    progressListener(progress: Progress) {
        this.progress = progress;
    }
}
