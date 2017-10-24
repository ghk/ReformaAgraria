import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../services/alert';
import { AccountService } from '../services/account';


@Component({
    selector: 'ra-user-management',
    templateUrl: '../templates/userManagement.html'
})

export class UserManagementComponent {
    model: any = {};
    allUsers: Array<string>;
    isRegisterShown: boolean = false;
    isEditShown: boolean = false;

    constructor(
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.getAllUsers();
    }

    getAllUsers() {
        this.accountService.getAllUsers()
            .subscribe(
                data => {
                    this.allUsers = data;
                },
                error => {
                    this.alertService.error(error);
                });
    }

    deleteUser(email: string) {
        this.accountService.deleteUser(email)
            .subscribe(
            data => {
                this.alertService.success('User ' + email + ' is successfully deleted.', true);
            },
            error => {
                this.alertService.error(error);
            });
    }

    updateUser() {
        console.log(this.model.newEmail + ', ' + this.model.oldEmail)
        this.accountService.updateUser(this.model.newEmail, this.model.oldEmail)
            .subscribe(
            data => {
                this.alertService.success('User ' + this.model.oldEmail + ' is successfully updated to ' + this.model.newEmail, true);
            },
            error => {
                this.alertService.error(error);
            });
    }

    addUser() {
        this.isRegisterShown = true;
    }
    editUser() {
        this.isEditShown = true;
    }
}
