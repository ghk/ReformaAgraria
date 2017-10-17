import { Headers, RequestOptions } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';

export class RequestHelper
{
    static getRequestOptions(cookieService: CookieService): RequestOptions {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let accessToken = cookieService.get('accessToken');
        if (accessToken) {
            headers.append('Authorization', 'Bearer ' + accessToken);
            return new RequestOptions({ headers: headers });
        }
    }
}