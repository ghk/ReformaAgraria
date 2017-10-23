${
    using Typewriter.Extensions.WebApi;
    using System.Text;

    static string serviceNamespaces = "ReformaAgraria.Controllers";
    string ReturnType(Method m) => m.Type.Name == "IHttpActionResult" ? "void" : m.Type.Name;
    string ServiceName(Class c) => c.Name.Replace("Controller", "Service");

    Template(Settings settings) 
    {
        settings.OutputFilenameFactory = file => 
        {
            var fileName = file.Name.Replace("Controller", "");
            fileName = Char.ToLowerInvariant(fileName[0]) + fileName.Substring(1);
            return fileName.Replace(".cs", ".ts");
        };
    }
    
    IEnumerable<string> GetInheritance(Class item) {
        if (item.BaseClass != null)
        {
            yield return item.BaseClass.Name;
            yield return item.BaseClass.FullName;
        }

        foreach (var implementedInterface in item.Interfaces)
        {
            yield return implementedInterface.Name;
            yield return implementedInterface.FullName;
        }
    }

    bool ServiceFilter(Class item) {  
        var inheritance = GetInheritance(item);
        if (item.Name != "ModelController" && 
            item.Name != "ReadOnlyController"  && 
            item.Name != "CrudController" && 
            inheritance.Any(i => i == "ModelController" || i == "ReadOnlyController" || i == "CrudController"))
            return true;
        return false;
    }

    string GetFirstType(Class item) {
        var type = item.BaseClass.TypeArguments.FirstOrDefault();
        return $"{type}";
    }

}$Classes($ServiceFilter)[import { Injectable } from '@angular/core';
import { Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProgressHttp } from 'angular-progress-http';
import { CookieService } from 'ngx-cookie-service';

import { Query } from '../../models/query';
import { $GetFirstType } from '../../models/gen/$GetFirstType';
import { RequestHelper } from '../../helpers/request';
import { SharedService } from '../../services/shared';

import * as urljoin from 'url-join';

@Injectable()
export class $ServiceName {        

    private serverUrl: any;
   
    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private sharedService: SharedService) { 
        this.serverUrl = this.sharedService.getEnvironment().serverUrl;
    } 

    public GetAll(query: Query, progressListener: any): Observable<Array<$GetFirstType>> { 
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'GET',
            urljoin(this.serverUrl, '$GetFirstType'),
            query,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public Count(query: Query, progressListener: any): Observable<number> { 
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'GET',
            urljoin(this.serverUrl, '$GetFirstType', 'count'),
            query,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public Get(Id: any, progressListener: any): Observable<$GetFirstType> {
            let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'GET',
            urljoin(this.serverUrl, '$GetFirstType', Id),
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}
