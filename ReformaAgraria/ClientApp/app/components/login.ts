import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { AccountService } from '../services/gen/account';
import { LoginViewModel } from '../models/gen/loginViewModel';

@Component({
    selector: 'ra-login',
    templateUrl: '../templates/login.html'
})
export class LoginComponent implements OnInit {
    model: LoginViewModel = {};
    message: string;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private cookieService: CookieService,
        private accountService: AccountService,        
    ) { }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.accountService.login(this.model).subscribe(
            resp => {
                if (resp && resp.data && resp.data.accessToken) {
                    this.cookieService.set('accessToken', resp.data.accessToken, 30, '/');                 
                }
                this.router.navigate([this.returnUrl]);                
            },
            error => {                
                this.message = error.message;
            }
        );
    }
}
