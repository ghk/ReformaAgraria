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
    invalidPassword: string = "";
    unmatchedPassword: string = "";
    isValid: boolean = false;

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
                this.getUserById(this.model.id);
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
