import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account';

@Component({
    selector: 'ra-forgot-password',
    templateUrl: '../templates/forgotPassword.html'
})

export class ForgotPasswordComponent {
    model: any = {};
    loading: boolean = false;
    showPage: boolean = true;

    constructor(
        private router: Router,
        private accountService: AccountService,
        private toastr: ToastrService) { }

    sendPasswordRecoveryLink() {
        this.loading = true;
        this.showPage = false;
        this.accountService.sendPasswordRecoveryLink(this.model)
            .subscribe(
                data => {
                    this.toastr.success('Email sent.', null);
                    this.router.navigate(['/account/login']);
                    this.loading = false;
                    this.showPage = true;
                },
                error => {
                    this.toastr.error(error, null);
                    this.loading = false;
                    this.showPage = true;
                });
    }
}
