using Microsoft.EntityFrameworkCore;
using ReformaAgraria.Models;
using System.Linq;

namespace ReformaAgraria.Helpers
{
    public static class ToraHelper
    {
        public static void CalculateToraObject(DbContext dbContext, ToraObject toraObject)
        {
            var size = dbContext.Set<ToraMap>().Where(tm => tm.FkToraObjectId == toraObject.Id).Sum(tm => tm.Size);
            var totalSubjects = dbContext.Set<ToraSubject>().Where(ts => ts.FkToraObjectId == toraObject.Id).Count();
            toraObject.Size = size;
            toraObject.TotalSubjects = totalSubjects;
            dbContext.Update(toraObject);
            dbContext.SaveChanges();
        }

        public static void CalculateToraMapSize(DbContext dbContext, ToraMap toraMap)
        {
            var features = TopologyHelper.GetFeatureCollection(toraMap.Geojson);            
            var size = TopologyHelper.GetArea(features);
            toraMap.Size = size;
            dbContext.Update(toraMap);
            dbContext.SaveChanges();
        }
    }
}