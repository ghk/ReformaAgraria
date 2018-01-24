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
    invalidPassword: string = "";
    invalidEmail: string = "";
    unmatchedPassword: string = "";
    isValid: boolean = false;
    loading: boolean = false;
    showPage: boolean = true;
    loadingAddUserModal: boolean = false;
    showAddUserModal: boolean = true;
    loadingEditEmailModal: boolean = false;
    showEditEmailModal: boolean = true;
    loadingChangePasswordModal: boolean = false;
    showChangePasswordModal: boolean = true;
    loadingDeleteUserModal: boolean = false;
    showDeleteUserModal: boolean = true;
    emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    constructor(
        private router: Router,
        private accountService: AccountService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.loading = true;
        this.showPage = false;
        this.getAllUser();
        $('#modalAddUser').on('shown.bs.modal', function () {
            $("#modalAddUser input[name='name']").focus();
        });
        $('#modalEditEmail').on('shown.bs.modal', function () {
            $("#modalEditEmail input[name='newEmail']").focus();
        });
        $('#modalEditPassword').on('shown.bs.modal', function () {
            $("#modalEditPassword input[name='newPassword']").focus();
        });
    }

    getAllUser() {
        this.accountService.getAllUser()
            .subscribe(
            data => {
                this.allUsers = data;
                this.loading = false;
                this.showPage = true;
            },
            error => {
                this.toastr.error(error, null);
                this.loading = false;
                this.showPage = true;
            });
    }

    delete(id: string, email: string) {
        this.id = id;
        this.email = email;
    }

    deleteUser() {
        this.loadingDeleteUserModal = true;
        this.showDeleteUserModal = false;
        this.accountService.deleteUser(this.id)
            .subscribe(
            data => {
                this.toastr.success('User ' + this.email + ' is successfully deleted.', null);
                this.showListUser();
                this.loadingDeleteUserModal = false;
                this.showDeleteUserModal = true;
                (<any>$('#modalDelete')).modal('hide');
            },
            error => {
                this.loadingDeleteUserModal = false;
                this.showDeleteUserModal = true;
                this.toastr.error(error, null);
            });
    }

    update(id: string, email: string) {
        this.clearForm();
        this.model.id = id;
        this.model.newEmail = email;
    }

    updateUser() {
        this.loadingEditEmailModal = true;
        this.showEditEmailModal = false;
        this.accountService.updateUser(this.model.id, this.model.newEmail).subscribe(data => {
            this.showListUser();
            this.loadingEditEmailModal = false;
            this.showEditEmailModal = true;
            (<any>$('#modalEditEmail')).modal('hide');
            this.toastr.success('User is successfully updated.', null);
        },
            error => {
                this.loadingEditEmailModal = false;
                this.showEditEmailModal = true;
                this.toastr.error(error, null);
            });
    }

    changePassword() {
        this.loadingChangePasswordModal = true;
        this.showChangePasswordModal = false;
        this.accountService.changePassword(this.model.id, this.model.newPassword)
            .subscribe(
            data => {
                this.showListUser();
                this.loadingChangePasswordModal = false;
                this.showChangePasswordModal = true;
                (<any>$('#modalEditPassword')).modal('hide');
                this.toastr.success('Password is successfully changed.', null);
            },
            error => {
                this.loadingChangePasswordModal = false;
                this.showChangePasswordModal = true;
                this.toastr.error(error, null);
            });
    }

    addUser() {
        this.loadingAddUserModal = true;
        this.showAddUserModal = false;
        this.accountService.register(this.model)
            .subscribe(
            data => {
                this.showListUser();
                this.loadingAddUserModal = false;
                this.showAddUserModal = true;
                (<any>$('#modalAddUser')).modal('hide');
                this.toastr.success('Registration successful', null)
            },
            error => {
                this.loadingAddUserModal = false;
                this.showAddUserModal = true;
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
        this.model.FullName = '';
        this.model.Email = '';
        this.model.Password = '';
        this.model.newEmail = '';
        this.model.currentPassword = '';
        this.model.newPassword = '';
        this.model.confirmPassword = '';
        this.model.Name = '';
        this.invalidEmail = '';
        this.invalidPassword = '';
        this.unmatchedPassword = '';
    }

    validateAddUserForm() {
        if (!this.emailregex.test(this.model.Email)) {
            this.invalidEmail = "Format email salah";
        }
        else if (this.model.Email.length == 0) {
            this.invalidEmail = "Email tidak boleh kosong";
        }
        else {
            this.invalidEmail = "";
        }

        if (this.model.Password.length < 5) {
            this.invalidPassword = "Password terlalu pendek";
        }
        else if (this.model.Password.length == 0) {
            this.invalidPassword = "Password tidak boleh kosong";
        }
        else {
            this.invalidPassword = "";
        }

        if (this.invalidPassword == "" && this.invalidEmail == "") {
            this.isValid = true;
        }
        else {
            this.isValid = false;
        }
    }

    validateUpdateEmailForm() {
        if (!this.emailregex.test(this.model.newEmail)) {
            this.invalidEmail = "Format email salah";
            this.isValid = false;
        }
        else if (this.model.newEmail.length == 0) {
            this.invalidEmail = "Email tidak boleh kosong";
            this.isValid = false;
        }
        else {
            this.invalidEmail = "";
            this.isValid = true;
        }
    }

    validateUpdatePasswordForm() {
        if (this.model.newPassword.length < 5) {
            this.invalidPassword = "Password terlalu pendek";
        }
        else if (this.model.newPassword.length == 0) {
            this.invalidPassword = "Password tidak boleh kosong";
        }
        else {
            this.invalidPassword = "";
        }

        if (this.invalidPassword == "" && this.unmatchedPassword == "") {
            this.isValid = true;
        }
        else {
            this.isValid = false;
        }
    }

    validatePasswordMatch() {
        if (this.model.newPassword != this.model.confirmPassword) {
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
