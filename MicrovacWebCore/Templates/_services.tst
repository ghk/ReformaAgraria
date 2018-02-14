${
    using Typewriter.Extensions.WebApi;
    using System.Text;

    static string serviceNamespaces = "ReformaAgraria.Controllers";
    string ServiceName(Class c) => c.Name.Replace("Controller", "Service");

    string GetCamelCase(string str) 
    {
        return $"{Char.ToLowerInvariant(str[0]) + str.Substring(1)}";
    }

    Template(Settings settings) 
    {
        settings.OutputFilenameFactory = file => 
        {
            var fileName = file.Name.Replace("Controller", "");
            fileName = GetCamelCase(fileName);
            return fileName.Replace(".cs", ".ts");
        };
    }
    
    IEnumerable<string> GetInheritance(Class item) 
    {
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

    bool ServiceFilter(Class item) 
    {  
        if (item.Attributes.Any(attr => attr.Name == "NotGenerated"))
            return false;

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
                i == "CrudControllerAsync" ||
                i == "ControllerBase"
            )
        )
            return true;
        return false;
    }

    string Imports(Class item) 
    {        
		List<string> neededImports = new List<string>();
        foreach (var method in ApiMethods(item)) 
        {
            if (!method.Type.IsPrimitive && method.Type.Name != "IActionResult" && method.Type.Name != "FileStreamResult")
                neededImports.Add(GetImport(method.Type));

            foreach (var p in method.Parameters) 
            {
                if (!p.Type.IsPrimitive)
                    neededImports.Add(GetImport(p.Type));
            }
        }        

        var firstType = GetFirstType(item);
        if (firstType != null)
            neededImports.Add(GetImport(firstType));
		return String.Join("\n", neededImports.Distinct());
	}

    bool IsCrudController(Class item) 
    {
        var inheritance = GetInheritance(item);
        return inheritance.Any(i => i == "CrudController" || i == "CrudControllerAsync");
    }

    bool IsReadOnlyController(Class item)
    {
        var result = false;
        var inheritance = GetInheritance(item);
        result = inheritance.Any(i => i == "ReadOnlyController" || i == "ReadOnlyControllerAsync");
        if (!result && item.BaseClass != null) {
            inheritance = GetInheritance(item.BaseClass);
            result = inheritance.Any(i => i == "ReadOnlyController" || i == "ReadOnlyControllerAsync");
        }
        return result;
    }

    Type GetFirstType(Class item) 
    {
        var type = item.BaseClass.TypeArguments.FirstOrDefault();
        return type;
    }

    Type GetSecondType(Class item) 
    {
        var type = item.BaseClass.TypeArguments.LastOrDefault();
        return type;
    }

    string GetLowerFirstType(Class item) 
    {
        var type = item.BaseClass.TypeArguments.FirstOrDefault();
        return $"{type.Name.ToLower()}";
    }

    string GetHttpMethod(Method method) 
    {
        return method.HttpMethod().ToUpperInvariant();
    }

    string GetUrl(Method method) 
    {
        var url = "urljoin(this.serverUrl, ";
        foreach(var u in method.Url().Split('/'))
        {
            if (u == "api")
                continue;
            if (u.StartsWith("${")) {
                var neu = u.Remove(0, 2);
                url += neu.Remove(neu.Length - 1) + ", ";
            }
            else {
                var neu = u.ToLowerInvariant();                
                var isEncodeURI = neu.Contains("encodeuri");                
                if (isEncodeURI) {
                    neu = "('" + neu;
                    neu = neu.Replace("${encodeuricomponent", "' + encodeURIComponent");
                    neu = neu.Replace("}", " + '"); // "'" WTF? Bug in typewriter
                    neu = neu.Remove(neu.Length - 4);
                    url += neu + "), ";
                }
                else
                    url += "'" + neu + "', ";
            }
        }
        url = url.Remove(url.Length - 2);
        return url + ")";
    }

    string GetParameters(Method method) 
    {        
        var parameters = "";

        var containsGet = method.Attributes.Any(attr => attr.Name == "HttpGet");
        if (containsGet)
            parameters += "query?: Query, ";

        parameters += "progressListener?: any";

        var prepend = "";
        foreach (var p in method.Parameters) {
            if (p.Attributes.Any(attr => attr.Name == "FromBody"))
                prepend += "model: " + p.Type.Name + ", ";
            else if (p.Attributes.Any(attr => attr.Name == "FromForm"))
                prepend += "model: FormData, ";
            else
                prepend += p.Name + ": " + p.Type.Name + ", ";
        }
        if (prepend.Length > 0) 
            parameters = prepend + parameters;

        return parameters;
    }

    List<Method> ApiMethods(Class item)
    {
        var result = new List<Method>();
        foreach (var method in item.Methods) 
        {            
            var isNotGenerated = method.Attributes.Any(attr => attr.Name == "NotGenerated");
            if (isNotGenerated)
                continue;

            var isApi = method.Attributes.Any(attr => 
                attr.Name == "HttpPost" ||
                attr.Name == "HttpPut" ||
                attr.Name == "HttpGet" ||
                attr.Name == "HttpDelete");

            if (isApi)
                result.Add(method);            
        }

        return result;
    }

    bool IsForm(Method method) 
    {
        var result = false;
        foreach (var p in method.Parameters) {            
            result = p.Attributes.Any(attr => attr.Name == "FromForm");
            if (result)
                break;
        }
        return result;
    }

    bool IsBody(Method method) 
    {
        var result = method.Attributes.Any(attr => attr.Name == "HttpPost" || attr.Name == "HttpPut");            
        return result;
    }

    bool IsBlob(Method method) 
    {
        if (method.Type.Name == "FileStreamResult")
            return true;
        return false;
    }

    bool IsAnyType(Type type) 
    {
        if (type.Name == "IActionResult" || type.Name == "FileStreamResult") 
            return true;
        return false;
    }

    string GetImport(Type type) {
        return "import { " + type.Name.TrimEnd('[',']') + " } from '../../models/gen/" + type.name.TrimEnd('[',']') + "';";
    }

}$Classes($ServiceFilter)[import { Injectable } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProgressHttp } from 'angular-progress-http';
import { CookieService } from 'ngx-cookie-service';

import { Query } from '../../models/query';
$Imports
import { EnvironmentService } from '../../services/environment';
$IsCrudController[import { CrudService } from '../../services/crud';][]
import { RequestHelper } from '../../helpers/request';

import * as urljoin from 'url-join';

@Injectable()
export class $ServiceName $IsCrudController[implements CrudService<$GetFirstType[$Name], $GetSecondType[$Name]>][]{        

    private serverUrl: string;
   
    constructor(
        private http: ProgressHttp,
        private cookieService: CookieService,
        private environmentService: EnvironmentService) { 
        this.serverUrl = this.environmentService.getEnvironment().serverUrl;
    }$IsReadOnlyController[

    public getAll(query?: Query, progressListener?: any): Observable<Array<$GetFirstType[$Name]>> { 
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, '$GetLowerFirstType'),            
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public count(query?: Query, progressListener?: any): Observable<number> { 
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, '$GetLowerFirstType', 'count'),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public getById(id: $GetSecondType[$Name], query?: Query, progressListener?: any): Observable<$GetFirstType[$Name]> {
        let options = RequestHelper.getRequestOptions(this.cookieService, query);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'GET',
            urljoin(this.serverUrl, '$GetLowerFirstType', id),
            null,
            progressListener,
            null
        );

        return request.map(res => res.json()).catch(this.handleError);
    }][]$IsCrudController[

    public createOrUpdate(model: $GetFirstType[$Name], progressListener?: any): Observable<number> {
        if (!model['id']) {
            return this.create(model, progressListener);
        } else if (model['id']) {
            return this.update(model, progressListener);       
        }
    }

    public create(model: $GetFirstType[$Name], progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'POST',
            urljoin(this.serverUrl, '$GetLowerFirstType'),            
            model,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public update(model: $GetFirstType[$Name], progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'PUT',
            urljoin(this.serverUrl, '$GetLowerFirstType'),
            model,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }

    public deleteById(id: any, progressListener?: any): Observable<number> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            'DELETE',
            urljoin(this.serverUrl, '$GetLowerFirstType', id),
            null,
            null,
            progressListener
        );

        return request.map(res => res.json()).catch(this.handleError);
    }]
    $ApiMethods[
    public $name($GetParameters): Observable<$Type[$IsAnyType[any][$Name]]> {
        let options = RequestHelper.getRequestOptions(this.cookieService, null);
        $IsForm[options.headers.delete('Content-Type');][]$IsBlob[options.responseType = ResponseContentType.Blob;][]                
        let request = RequestHelper.getHttpRequest(
            this.http,
            options,
            '$GetHttpMethod',
            $GetUrl,
            $IsBody[model][null],
            $IsBody[null][progressListener],
            $IsBody[progressListener][null],
        );

        $IsBlob[return request.catch(this.handleError)][return request.map(res => res.json()).catch(this.handleError);]
    }
    ]
    private handleError(error: Response) {
        return Observable.throw(error);
    }
}