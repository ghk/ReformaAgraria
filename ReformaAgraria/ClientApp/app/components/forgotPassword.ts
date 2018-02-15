import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AccountService } from '../services/gen/account';

@Component({
    selector: 'ra-forgot-password',
    templateUrl: '../templates/forgotPassword.html'
})
export class ForgotPasswordComponent {
    model: any = {};

    constructor(
        private router: Router,
        private accountService: AccountService,
        private toastr: ToastrService) { }

    recoverPassword() {
        this.accountService.recoverPassword(this.model).subscribe(
            data => {
                this.toastr.success('Email terkirim', null);
                this.router.navigate(['/account/login']);
            },
            error => {
                this.toastr.error(error, null);
            }
        );
    }
}
