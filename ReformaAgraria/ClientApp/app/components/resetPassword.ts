import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService } from '../services/alert';
import { AccountService } from '../services/account';


@Component({
    selector: 'ra-reset-password',
    templateUrl: '../templates/resetPassword.html'
})

export class ResetPasswordComponent {
    model: any = {};
    user: any = {};

    constructor(
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route
            .queryParams
            .subscribe(params => {
                this.model.token = params['token'];
                this.model.id = params['id'];
            });
    }

    resetPassword() {
        this.accountService.resetPassword(this.model.id, this.model.token, this.model.password)
            .subscribe(
                data => {
                    this.alertService.success('Password is successfully Reset', true);
                },
                error => {
                    this.alertService.error(error);
                });
    }

    getUserById(id: string) {
        this.accountService.getUserById(this.model.id)
        .subscribe(
            data => {
                this.model.email = data.email;
            },
            error => {
                this.alertService.error(error);
            });
    }
}
