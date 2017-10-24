import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../services/alert';
import { AccountService } from '../services/account';


@Component({
    moduleId: 'ra-forgotpassword',
    templateUrl: '../templates/forgotPassword.html'
})

export class ForgotPasswordComponent {
    model: any = {};

    constructor(
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService) { }

    sendpasswordrecoverylink() {
        this.accountService.sendpasswordrecoverylink(this.model)
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                });
    }
}
