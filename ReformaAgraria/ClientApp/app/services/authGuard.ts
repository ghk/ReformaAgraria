import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private cookieService: CookieService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.cookieService.get('currentUser')) {     
            let roles = route.data['roles'] as Array<string>;       
            if (!roles)
                return true;

            let payload = jwt.decode(this.cookieService.get('accessToken'));            
            let userRoles = payload['role'];            
            if (userRoles) {
                if (typeof userRoles === 'string') {
                    if (roles.indexOf(userRoles) !== -1)
                        return true;
                }
                else {
                    for (let i = 0; i < userRoles.length; i++) {
                        if (roles.indexOf(userRoles[i]) !== -1)
                            return true;
                    }
                }
            }
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}