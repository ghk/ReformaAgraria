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
    allUsers: any = [];
    isRegisterShown: boolean = false;
    isEditShown: boolean = false;
    isChangePasswordShown: boolean = false;
    isListUserShown: boolean = true;

    constructor(
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.getAllUser();
    }

    getAllUser() {
        this.accountService.getAllUser()
            .subscribe(
                data => {
                    this.allUsers = data;
                    console.log(this.allUsers);
                },
                error => {
                    this.alertService.error(error);
                });
    }

    deleteUser(id: string, email: string) {
        if (confirm('Apakah kamu yakin ingin menghapus ' + email + '?')) {
            this.accountService.deleteUser(id)
                .subscribe(
                data => {
                    this.alertService.success('User ' + email + ' is successfully deleted.', true);
                    this.getAllUser();
                },
                error => {
                    this.alertService.error(error);
                });
        }
    }

    updateUser() {
        this.accountService.updateUser(this.model.id, this.model.newEmail)
            .subscribe(
            data => {
                this.alertService.success('User ' + this.model.oldEmail + ' is successfully updated to ' + this.model.newEmail, true);
                this.getAllUser();
                this.showListUser();
            },
            error => {
                this.alertService.error(error);
            });
    }

    changePassword() {
        this.accountService.changePassword(this.model.id, this.model.currentPassword, this.model.newPassword)
            .subscribe(
            data => {
                this.alertService.success('Password is successfully changed.', true);
            },
            error => {
                this.alertService.error(error);
            });
    }

    addUser() {
        this.accountService.register(this.model)
            .subscribe(
            data => {
                this.alertService.success('Registration successful', true);
                this.getAllUser();
                this.showListUser();
            },
            error => {
                this.alertService.error(error);
            });
    }

    showAddUser() {
        this.isRegisterShown = true;
        this.isEditShown = false;
        this.isListUserShown = false;
        this.isChangePasswordShown = false;
    }

    showEditUser(id: string, oldEmail: string) {
        this.model.oldEmail = oldEmail;
        this.model.newEmail = oldEmail;
        this.model.id = id;
        this.isRegisterShown = false;
        this.isEditShown = true;
        this.isListUserShown = false;
        this.isChangePasswordShown = false;
    }

    showListUser() {
        this.getAllUser();
        this.isRegisterShown = false;
        this.isEditShown = false;
        this.isListUserShown = true;
        this.isChangePasswordShown = false;
    }

    showChangePassword() {
        this.isRegisterShown = false;
        this.isEditShown = false;
        this.isListUserShown = false;
        this.isChangePasswordShown = true;
    }
}
