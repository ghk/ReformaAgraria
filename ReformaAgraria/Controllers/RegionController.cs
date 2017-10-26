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
    [Authorize(Policy = "Bearer")]
    public class RegionController : ReadOnlyController<Region, string>
    {
        public RegionController(ReformaAgrariaDbContext dbContext): base(dbContext) { }

        //protected override IQueryable<Region> ApplyQuery(IQueryable<Region> query)
        //{
        //    var type = GetQueryString<int>("type");
        //    var parentId = GetQueryString<string>("parentid");

        //    query = query.Where(r => r.Type == (RegionType)type).Where(r => r.FkParentId == parentId);

        //    return query;
        //}

        [HttpGet("getregion")]
        public IList<Region> GetRegion(int type, string parentId) {
            return base.GetAll().Where(r => r.Type == (RegionType)type).Where(r => r.FkParentId == parentId).ToList();
        }
    }
}