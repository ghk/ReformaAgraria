import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account';


@Component({
    selector: 'ra-reset-password',
    templateUrl: '../templates/resetPassword.html'
})

export class ResetPasswordComponent {
    model: any = {};
    user: any = {};
    invalidPassword: string = "";
    unmatchedPassword: string = "";
    isValid: boolean = false;
    loading: boolean = false;
    showPage: boolean = true;

    constructor(
        private router: Router,
        private accountService: AccountService,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.route
            .queryParams
            .subscribe(params => {
                this.model.token = params['token'];
                this.model.id = params['id'];
                this.model.email = params['email'];
            });
    }

    resetPassword() {
        this.loading = true;
        this.showPage = false;
        this.accountService.changePassword(this.model.id, this.model.password)
            .subscribe(
            data => {
                this.loading = false;
                this.showPage = true;
                this.toastr.success('Password berhasil diubah', null);
                this.router.navigate(['/account/login']);
            },
            error => {
                this.loading = false;
                this.showPage = true;
                this.toastr.error(error, null);
            });
    }

    validateResetPasswordForm() {
        if (this.model.password.length < 5) {
            this.invalidPassword = "Password terlalu pendek";
        }
        else if (this.model.password.length == 0) {
            this.invalidPassword = "Password tidak boleh kosong";
        }
        else {
            this.invalidPassword = "";
        }

        if (this.model.password != this.model.confirmPassword) {
            this.unmatchedPassword = "Password tidak sama";
            this.isValid = false;
        }
        else if (this.model.confirmPassword.length == 0) {
            this.unmatchedPassword = "Konfirmasi Password tidak boleh kosong";
        }
        else {
            this.unmatchedPassword = "";
        }

        if (this.invalidPassword == "" && this.unmatchedPassword == "") {
            this.isValid = true;
        }
        else {
            this.isValid = false;
        }
    }
}
