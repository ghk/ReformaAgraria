${
	static string modelNamespace = "ReformaAgraria.Models";

    Template(Settings settings) 
    {
        settings.OutputFilenameFactory = file => 
        {
            var fileName = file.Name;
            fileName = Char.ToLowerInvariant(fileName[0]) + fileName.Substring(1);
            return fileName.Replace(".cs", ".ts");
        };
    }
}$Enums(en => en.Namespace == modelNamespace)[export enum $Name { $Values[
	$Name,]
}]
