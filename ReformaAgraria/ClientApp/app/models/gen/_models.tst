${ 
	static string modelNamespace = "ReformaAgraria.Models";
    static string viewModelNamespace = "ReformaAgraria.Models.ViewModels";

    Template(Settings settings) 
    {
        settings.OutputFilenameFactory = file => 
        {
            var fileName = file.Name;
            fileName = Char.ToLowerInvariant(fileName[0]) + fileName.Substring(1);
            return fileName.Replace(".cs", ".ts");
        };
    }

	string Inherit(Class c)
	{
		if (c.BaseClass != null)
			if (c.BaseClass.IsGeneric)
				return " extends " + c.BaseClass.ToString() + c.BaseClass.TypeArguments;
			else
				return " extends " + c.BaseClass.ToString();
		else
			return  "";
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

	string Imports(Class c){
        if (c.Name == "BaseEntity")
            return "";

		List<string> neededImports = c.Properties
			.Where(p => (!p.Type.IsPrimitive || p.Type.IsEnum))
			.Select(p => "import { " + p.Type.Name.TrimEnd('[',']') + " } from './" + p.Type.name.TrimEnd('[',']') + "';")
			.ToList();			
		if (c.BaseClass != null) {
			neededImports.Add("import { " + c.BaseClass.Name +" } from './" + c.BaseClass.name + "';");
		}
		return String.Join("\n", neededImports.Distinct());
	}

    bool ModelFilter(Class item) {
        var inheritance = GetInheritance(item);
        if (item.Namespace == modelNamespace && 
            inheritance.Any(i => i == "IModel" || i == "BaseEntity"))
            return true;
        else if (item.Namespace == viewModelNamespace)
            return true;
        return false;
    }

    bool IsPropertyNullable(Property prop) {
        if (prop.Type.IsNullable)
            return true;
        else if (prop.Attributes.Any(a => a.Name == "ForeignKey"))
            return true;
        return false;
    }

}$Classes($ModelFilter)[$Imports

export interface $Name$TypeParameters$Inherit { $Properties[
    $name?: $Type;]
}]
