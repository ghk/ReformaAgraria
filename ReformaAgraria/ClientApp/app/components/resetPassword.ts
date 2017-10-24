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
                this.model.Token = params['token'];
            });
    }

    resetPassword() {
        this.accountService.resetPassword(this.model)
            .subscribe(
                data => {
                    this.alertService.success('Password is successfully Reset', true);
                },
                error => {
                    this.alertService.error(error);
                });
    }
}
