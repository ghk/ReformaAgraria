import { Component, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AccountService } from '../services/gen/account';
import { emailValidator } from '../validators/emailValidator';
import { UserViewModel } from '../models/gen/userViewModel';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { matchValidator } from '../validators/matchValidator';
import { Subscription } from 'rxjs';
import { ModalDeleteComponent } from './modals/delete';
import { SharedService } from '../services/shared';
import { RegionService } from '../services/gen/region';

@Component({
    selector: 'ra-user-management',
    templateUrl: '../templates/userManagement.html'
})
export class UserManagementComponent implements OnInit, OnDestroy {
    addUserForm: FormGroup;
    addUserModalRef: BsModalRef;
    editEmailForm: FormGroup;
    editEmailModalRef: BsModalRef;
    editPasswordForm: FormGroup;
    editPasswordModalRef: BsModalRef;
    deleteModalRef: BsModalRef;
    deleteSubscription: Subscription;

    currentUser: UserViewModel;
    users: UserViewModel[] = [];    
    emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private sharedService: SharedService,
        private regionService: RegionService,
        private accountService: AccountService
    ) { }

    ngOnInit() {
        if (!this.sharedService.region) {
            this.regionService.getById('72.1').subscribe(region => {
                this.sharedService.setRegion(region);
            })
        };

        this.createForm();
        this.getAllUser();       
    }

    ngOnDestroy(): void {
        if (this.deleteSubscription)
            this.deleteSubscription.unsubscribe();
    }

    createForm(): void {
        this.addUserForm = this.fb.group({
            fullName: ['', [Validators.required]],
            email: ['', [Validators.required, emailValidator(this.emailregex)]],
            password: ['', [
                Validators.required, 
                Validators.minLength(5)
            ]],
            confirmPassword: ['', [
                Validators.required,                 
            ]]            
        }, {
            validator: matchValidator('password', 'confirmPassword')
        });

        this.editEmailForm = this.fb.group({            
            newEmail: ['', [Validators.required, emailValidator(this.emailregex)]],
        });

        this.editPasswordForm = this.fb.group({
            newPassword: ['', [
                Validators.required, 
                Validators.minLength(5)
            ]],
            confirmPassword: ['', [
                Validators.required,                 
            ]]            
        }, {
            validator: matchValidator('newPassword', 'confirmPassword')
        });
    }  

    onShowAddUser(template: TemplateRef<any>) {
        this.addUserModalRef = this.modalService.show(template);
    }

    onShowEditEmail(template: TemplateRef<any>, user: UserViewModel) {        
        this.currentUser = user;
        this.editEmailModalRef = this.modalService.show(template);
    }

    onShowEditPassword(template: TemplateRef<any>, user: UserViewModel) {
        this.currentUser = user;
        this.editPasswordModalRef = this.modalService.show(template);
    }  
    
    onDeleteUser(user: UserViewModel): void {
        this.deleteModalRef = this.modalService.show(ModalDeleteComponent);
        this.deleteModalRef.content.setModel(user);
        this.deleteModalRef.content.setService(this.accountService);
        this.deleteModalRef.content.setLabel(user.email);
        if (!this.deleteSubscription)
            this.deleteSubscription = this.deleteModalRef.content.isDeleteSuccess$.subscribe(error => {
                if (!error) {
                    this.getAllUser();
                }
                this.deleteSubscription.unsubscribe();
                this.deleteSubscription = null;
                this.deleteModalRef.hide();
            });
    }
    
    getAllUser() {
        this.accountService.getAll().subscribe(
            data => {
                this.users = data;
            },
            error => {
                this.toastr.error(error, null);
            }
        );
    }
  
    addUser() {
        let model = this.addUserForm.value;
        this.accountService.register(model).subscribe(
            data => {
                this.getAllUser();
                this.toastr.success('Registrasi berhasil', null)
            },
            error => {
                this.toastr.error('Ada kesalahan dalam penyimpanan', null);
            }
        );
    }

    updateUserEmail(): void {   
        const model = this.editEmailForm.value;  
        let newEmail = model.newEmail as string;      

        this.accountService.updateUserEmail(this.currentUser.id, { 'email': newEmail }).subscribe(
            data => {                
                this.getAllUser();
                this.toastr.success('Email berhasil diubah', null);
            },
            error => {
                this.toastr.error('Ada kesalahan dalam penyimpanan', null);                
            }
        );
    }

    updateUserPassword(): void {
        const model = this.editPasswordForm.value;
        let newPassword = model.newPassword as string;
        let confirmPassword = model.confirmPassword as string;

        this.accountService.changePassword(this.currentUser.email, {'newPassword': newPassword}).subscribe(
            data => {
                this.getAllUser();
                this.toastr.success('Password berhasil diubah', null);
            },
            error => {
                this.toastr.error('Ada kesalahan dalam penyimpanan');
            }
        );
    }
  
    // Edit Email Form
    get newEmailControl() { return this.editEmailForm.get('newEmail'); }
    
    // Edit Password Form
    get newPasswordControl() { return this.editPasswordForm.get('newPassword'); }
    get confirmNewPasswordControl() { return this.editPasswordForm.get('confirmPassword'); }  
    
    // Add User Form
    get fullNameControl() { return this.addUserForm.get('fullName'); }
    get emailControl() { return this.addUserForm.get('email'); }
    get passwordControl() { return this.addUserForm.get('password'); }
    get confirmPasswordControl() { return this.addUserForm.get('confirmPassword'); }
}
