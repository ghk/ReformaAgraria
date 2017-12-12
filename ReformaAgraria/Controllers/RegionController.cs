﻿using System;
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
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]    
    [Route("api/[controller]")]
    //[Authorize(Policy = "Bearer")]
    public class RegionController : ReadOnlyController<Region, string>
    {
        private readonly ILogger<RegionController> _logger;

        public RegionController(ReformaAgrariaDbContext dbContext, 
            ILogger<RegionController> logger): base(dbContext)
        {
            _logger = logger;
        }

        protected override IQueryable<Region> ApplyQuery(IQueryable<Region> query)
        {
            var type = GetQueryString<string>("type");
            if (type != null)
            {
                if (type == "breadcrumb")
                {
                    var depth = GetQueryString<int>("depth");
                    for (var i = 1; i <= depth; i++)
                    {
                        var includeString = string.Concat(Enumerable.Repeat("Parent.", i));
                        includeString = includeString.Remove(includeString.Length - 1);
                        query = query.Include(includeString);
                    }
                }

                if (type == "parent")
                {
                    var parentId = GetQueryString<string>("parentId");
                    var regionType = GetQueryString<int?>("regionType");

                    if (!string.IsNullOrWhiteSpace(parentId))
                    {
                        query = query.Where(r => r.FkParentId == parentId);

                    }
                    if (regionType != null)
                    {
                        query = query.Where(r => r.Type == (RegionType)regionType);
                    }
                }
            }

            return query;
        }
        
    }
}