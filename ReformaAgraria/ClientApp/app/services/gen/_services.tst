${
    using Typewriter.Extensions.WebApi;
    using System.Text;

    static string serviceNamespaces = "ReformaAgraria.Services";
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
}import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map'

@Injectable()
$Classes($ServiceFilter)[export class $Name {        
    constructor(private $http: ng.IHttpService) { 
    } $Methods[
        
    public $name = ($Parameters[$name: $Type][, ]) : ng.IHttpPromise<$ReturnType> => {
            
        return this.$http<$ReturnType>({
            url: `$Url`, 
            method: "$HttpMethod", 
            data: $RequestData
        });
    };]
}
