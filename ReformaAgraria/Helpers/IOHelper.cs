using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Helpers
{
    public static class IOHelper
    {
        public static void CreateDirectory(string filePath)
        {
            var directoryPath = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directoryPath))
                Directory.CreateDirectory(directoryPath);
        }

        public static void StreamCopy(string filePath, IFormFile file)
        {
            CreateDirectory(filePath);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {                
                file.CopyTo(stream);
            }
        }

        public static string ExtractTempZip(IFormFile file)
        {
            var tempDirectoryName = Guid.NewGuid().ToString("N");
            var tempDirectoryPath = Path.Combine(Path.GetTempPath(), tempDirectoryName);
            var zipPath = Path.Combine(tempDirectoryPath, file.FileName);

            StreamCopy(zipPath, file);
            ZipFile.ExtractToDirectory(zipPath, tempDirectoryPath);

            return tempDirectoryPath;
        }
    }
}
