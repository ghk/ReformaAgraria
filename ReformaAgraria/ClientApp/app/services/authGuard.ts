import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from './shared';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private cookieService: CookieService,
        private sharedService: SharedService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let user = this.sharedService.getCurrentUser();
        if (user) {     
            let roles = route.data['roles'] as Array<string>;       
            if (!roles)
                return true;

            for (let i = 0; i < user.role.length; i++) {
                if (roles.indexOf(user.role[i]) !== -1)
                    return true;
            }
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}