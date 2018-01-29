import { Headers, RequestOptions, URLSearchParams, Http, Response } from '@angular/http';
import { ProgressHttp } from 'angular-progress-http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from "rxjs/Observable";
import { Query } from '../models/query';

export class RequestHelper {
    static getRequestOptions(cookieService: CookieService, query: Query): RequestOptions {
        var result = new RequestOptions();
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let accessToken = cookieService.get('accessToken');
        if (accessToken) {
            headers.append('Authorization', 'Bearer ' + accessToken);
            result.headers = headers;
        }

        if (!query)
            return result;

        let params = new URLSearchParams();
        if (query.page && query.perPage) {
            params.append('page', query.page.toString());
            params.append('perPage', query.perPage.toString());
        }
        if (query.sort)
            params.append('sort', query.sort);
        if (query.keywords)
            params.append('keywords', query.keywords);
        if (query.data) {
            Object.keys(query.data).forEach(key => {
                params.append(key, query.data[key]);
            })
        }

        result.params = params;

        return result;
    }

    static getHttpRequest(
        http: ProgressHttp, 
        options: RequestOptions, 
        method: string, 
        url: string, 
        body: any, 
        downloadListener?, 
        uploadListener?
    ): Observable<Response> {
        if (body)
            options.body = body;
        options.method = method;
        
        let req: Http = http;       
        if (downloadListener)
            req = http.withDownloadProgressListener(downloadListener);
        if (uploadListener)
            req = http.withUploadProgressListener(uploadListener);

        return req.request(url, options);
    }
}