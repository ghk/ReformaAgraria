${
    using Typewriter.Extensions.WebApi;
    using System.Text;

    static string serviceNamespaces = "ReformaAgraria.Controllers";
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
            item.Name != "ModelControllerAsync" && 
            item.Name != "ReadOnlyControllerAsync"  && 
            item.Name != "CrudControllerAsync" && 
            inheritance.Any(i => 
                i == "ModelController" || 
                i == "ReadOnlyController" || 
                i == "CrudController" ||
                i == "ModelControllerAsync" || 
                i == "ReadOnlyControllerAsync" || 
                i == "CrudControllerAsync"
            )
        )
            return true;
        return false;
    }

    bool IsCrudController(Class item) {
        var inheritance = GetInheritance(item);
        return inheritance.Any(i => i == "CrudController" || i == "CrudControllerAsync");
    }

    string GetFirstType(Class item) {
        var type = item.BaseClass.TypeArguments.FirstOrDefault();
        return $"{type}";
    }

    string GetSecondType(Class item) {
        var type = item.BaseClass.TypeArguments.LastOrDefault();
        return $"{type}";
    }

    string GetLowerFirstType(Class item) {
        var type = item.BaseClass.TypeArguments.FirstOrDefault();
        return $"{type.ToString().ToLower()}";
    }

    string GetCamelCaseFirstType(Class item) {
        var type = item.BaseClass.TypeArguments.FirstOrDefault();
        return $"{Char.ToLowerInvariant(type.ToString()[0]) + type.ToString().Substring(1)}";
    }

}$Classes($ServiceFilter)[import { Injectable } from '@angular/core';
import { Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProgressHttp } from 'angular-progress-http';
import { CookieService } from 'ngx-cookie-service';

import { Query } from '../../models/query';
import { $GetFirstType } from '../../models/gen/$GetCamelCaseFirstType';
import { RequestHelper } from '../../helpers/request';
import { SharedService } from '../../services/shared';
import { CrudService } from '../../services/crud';

import * as urljoin from 'url-join';

@Injectable()
export class $ServiceName implements CrudService<$GetFirstType, $GetSecondType>{        

    private serverUrl: string;
   
    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private sharedService: SharedService) { 
        this.serverUrl = this.sharedService.getEnvironment().serverUrl;
    } 

    public getAll(query?: Query, progressListener?: any): Observable<Array<$GetFirstType>> { 
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'GET',
            urljoin(this.serverUrl, '$GetLowerFirstType'),
            query,
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public count(query?: Query, progressListener?: any): Observable<number> { 
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'GET',
            urljoin(this.serverUrl, '$GetLowerFirstType', 'count'),
            query,
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public getById(id: $GetSecondType, query?: Query, progressListener?: any): Observable<$GetFirstType> {
            let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'GET',
            urljoin(this.serverUrl, '$GetLowerFirstType', id),
            query,
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    $IsCrudController[
    public createOrUpdate(model: $GetFirstType, progressListener?: any): Observable<number> {
        let method = 'POST';
        if (!model['id']) {
            return this.create(model, progressListener);
        } else if (model['id']) {
            return this.update(model, progressListener);       
        }
    }

    public create(model: $GetFirstType, progressListener?: any): Observable<number> {
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'POST',
            urljoin(this.serverUrl, '$GetLowerFirstType'),            
            null,
            model,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public update(model: $GetFirstType, progressListener?: any): Observable<number> {
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'PUT',
            urljoin(this.serverUrl, '$GetLowerFirstType'),
            null,
            model,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public deleteById(id: any, progressListener?: any): Observable<number> {
        let request = RequestHelper.getHttpRequest(
            this.cookieService,
            this.http,
            'DELETE',
            urljoin(this.serverUrl, '$GetLowerFirstType', id),
            null,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }
    ]
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