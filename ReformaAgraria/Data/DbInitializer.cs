using ReformaAgraria.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Data
{
    public class DbInitializer
    {
        public static void Initialize(ReformaAgrariaDataContext context)
        {
            context.Database.EnsureCreated();

            // Look for any kabupaten.
            if (context.Region.Any())
            {
                return;   // DB has been seeded
            }

            var region = new Region[]
            {
            new Region{Name="Sigi",Type=RegionType.REGENCY,fkParentId=null,DateCreated=DateTime.Now,DateModified=DateTime.Now},
            new Region{Name="Dolo",Type=RegionType.DISTRICT,fkParentId=1,DateCreated=DateTime.Now,DateModified=DateTime.Now},
            new Region{Name="Gumbasa",Type=RegionType.DISTRICT,fkParentId=1,DateCreated=DateTime.Now,DateModified=DateTime.Now},
            new Region{Name="Maku",Type=RegionType.VILLAGE,fkParentId=2,DateCreated=DateTime.Now,DateModified=DateTime.Now},
            new Region{Name="Tulo",Type=RegionType.VILLAGE,fkParentId=2,DateCreated=DateTime.Now,DateModified=DateTime.Now},
            new Region{Name="Tuwa",Type=RegionType.VILLAGE,fkParentId=3,DateCreated=DateTime.Now,DateModified=DateTime.Now},
            new Region{Name="Pakuli",Type=RegionType.VILLAGE,fkParentId=3,DateCreated=DateTime.Now,DateModified=DateTime.Now},
            };
            foreach (Region rg in region)
            {
                context.Region.Add(rg);
            }
            context.SaveChanges();
        }
    }
}
