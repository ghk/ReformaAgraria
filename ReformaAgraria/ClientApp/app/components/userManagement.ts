import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
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
    id: string;
    email: string;

    constructor(
        private router: Router,
        private accountService: AccountService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.getAllUser();
    }

    getAllUser() {
        this.accountService.getAllUser()
            .subscribe(
                data => {
                    this.allUsers = data;
                },
                error => {
                    this.toastr.error(error, null);
                });
    }

    delete(id: string, email: string) {
        this.id = id;
        this.email = email;
    }

    deleteUser() {
            this.accountService.deleteUser(this.id)
                .subscribe(
                data => {
                    this.toastr.success('User ' + this.email + ' is successfully deleted.', null);
                    this.showListUser();
                },
                error => {
                    this.toastr.error(error, null);
                });
    }

    update(id: string, email: string) {
        this.clearForm();
        this.model.id = id;
    }

    updateUser() {
        this.accountService.updateUser(this.model.id, this.model.newEmail).subscribe(data => {
                this.toastr.success('User is successfully updated.', null);
                this.showListUser();
            },
            error => {
                this.toastr.error(error, null);
            });
    }

    changePassword() {
        this.accountService.changePassword(this.model.id, this.model.currentPassword, this.model.newPassword)
            .subscribe(
            data => {
                console.log('success');
                this.toastr.success('Password is successfully changed.', null);
                this.showListUser();
            },
            error => {
                console.log('gagal');
                this.toastr.error(error, null);
            });
    }

    addUser() {
        this.accountService.register(this.model)
            .subscribe(
            data => {
                this.toastr.success('Registration successful', null)
                this.showListUser();
            },
            error => {
                this.toastr.error(error, null);
            });
    }
    
    showListUser() {
        this.clearForm();
        this.getAllUser();
    }

    clearForm() {
        this.email = '';
        this.id = '';
        this.model.Email = '';
        this.model.Password = '';
        this.model.newEmail = '';
        this.model.currentPassword = '';
        this.model.newPassword = '';
        this.model.confirmPassword = '';
        this.model.Name = '';
    }
}
