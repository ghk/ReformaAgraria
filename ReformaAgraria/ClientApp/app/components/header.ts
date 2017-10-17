import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '../services/account'; 

@Component({
    selector: 'ra-header',
    templateUrl: '../templates/header.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
    }

    logout(): void {
        this.accountService.logout().subscribe();
        this.router.navigateByUrl('/login');
    }

}