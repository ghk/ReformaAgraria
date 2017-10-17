import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../services/alert';
import { AccountService } from '../services/account';


@Component({
    moduleId: 'ra-register',
    templateUrl: '../templates/register.html'
})

export class RegisterComponent {
    model: any = {};

    constructor(
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService) { }

    register() {
        this.accountService.register(this.model)
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
