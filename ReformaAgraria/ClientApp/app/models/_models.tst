${ 
	static string modelNamespace = "ReformaAgraria.Models";
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
	string Imports(Class c){
		List<string> neededImports = c.Properties
			.Where(p => (!p.Type.IsPrimitive || p.Type.IsEnum) && !p.Type.IsGeneric)
			.Select(p => "import { " + p.Type.Name.TrimEnd('[',']') + " } from './" + p.Type.Name.TrimEnd('[',']') + "';")
			.ToList();			
		if (c.BaseClass != null) { 
			neededImports.Add("import { " + c.BaseClass.Name +" } from './" + c.BaseClass.Name + "';");
		}
		return String.Join("\n", neededImports.Distinct());
	}
}$Classes(cls => cls.Namespace == modelNamespace && (cls.Interfaces.Any(i => i.Name == "IModel") || cls.BaseClass.Name == "BaseEntity") && cls.Name != "BaseEntity")[$Imports

export interface $Name$TypeParameters$Inherit { $Properties[
	$name: $Type;]
}]
