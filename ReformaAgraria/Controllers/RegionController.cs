using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MicrovacWebCore;
using ReformaAgraria.Models;
using System.Linq;
using System.Linq.Dynamic.Core;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize(Policy = "Bearer")]
    public class RegionController : ReadOnlyControllerAsync<Region, string>
    {
        private readonly ILogger<RegionController> _logger;

        public RegionController(
            ReformaAgrariaDbContext dbContext,
            ILogger<RegionController> logger
        ) : base(dbContext)
        {
            _logger = logger;
        }

        protected override IQueryable<Region> ApplyQuery(IQueryable<Region> query)
        {
            var type = GetQueryString<string>("type");
            if (type == "getByDepth")
            {
                var depth = GetQueryString<int>("depth");
                for (var i = 1; i <= depth; i++)
                {
                    var includeString = string.Concat(Enumerable.Repeat("Parent.", i));
                    includeString = includeString.Remove(includeString.Length - 1);
                    query = query.Include(includeString);
                }
            }

            if (type == "getAllByParent")
            {
                var parentId = GetQueryString<string>("parentId");
                var regionType = GetQueryString<int?>("regionType");

                if (!string.IsNullOrWhiteSpace(parentId))
                    query = query.Where(r => r.FkParentId == parentId);
                if (regionType != null)
                    query = query.Where(r => r.Type == (RegionType)regionType);
            }

            return query;
        }
    }
}