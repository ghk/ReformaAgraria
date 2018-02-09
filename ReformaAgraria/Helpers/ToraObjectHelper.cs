using Microsoft.EntityFrameworkCore;
using ReformaAgraria.Models;
using System.Linq;

namespace ReformaAgraria.Helpers
{
    public static class ToraObjectHelper
    {
        public static void Calculate(DbContext dbContext, ToraObject toraObject)
        {
            var size = dbContext.Set<ToraMap>().Where(tm => tm.FkToraObjectId == toraObject.Id).Sum(tm => tm.Size);
            var totalSubjects = dbContext.Set<ToraSubject>().Where(ts => ts.FkToraObjectId == toraObject.Id).Count();
            toraObject.Size = size;
            toraObject.TotalSubjects = totalSubjects;
            dbContext.Update(toraObject);
            dbContext.SaveChanges();
        }
    }
}