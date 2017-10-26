using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MicrovacWebCore;
using ReformaAgraria.Models;
using Microsoft.AspNetCore.Authorization;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]    
    [Route("api/[controller]")]
    //[Authorize(Policy = "Bearer")]
    public class RegionController : ReadOnlyController<Region, string>
    {
        public RegionController(ReformaAgrariaDbContext dbContext): base(dbContext) { }

        protected override IQueryable<Region> ApplyQuery(IQueryable<Region> query)
        {
            var data = GetQueryString<Dictionary<string, object>>("data", null);

            if (data == null)
                return query;

            var type = (string)data.GetValueOrDefault("type");

            if (type == "parent")
            {
                var parentId = (string)data.GetValueOrDefault("parentId");
                var regionType = data.GetValueOrDefault("regionType", null);

                if (!string.IsNullOrWhiteSpace(parentId))
                {
                    query = query.Where(r => r.FkParentId == parentId);

                }
                if (regionType != null)
                {
                    query = query.Where(r => r.Type == (RegionType)regionType);
                }
            }

            return query;
        }
        
    }
}