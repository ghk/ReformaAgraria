﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public class EventTypeController : ReadOnlyControllerAsync<EventType, string>
    {
        private readonly ILogger<RegionController> _logger;

        public EventTypeController(
            ReformaAgrariaDbContext dbContext,
            ILogger<RegionController> logger
        ) : base(dbContext)
        {
            _logger = logger;
        }

        protected override IQueryable<EventType> ApplyQuery(IQueryable<EventType> query)
        {
            var type = GetQueryString<string>("type");

            if (type == "getAllByRegionType")
            {
                var regionType = GetQueryString<int?>("regionType");
                if (regionType != null)
                    query = query.Where(et => et.RegionType >= (RegionType)regionType.Value);
            }

            return query;
        }
    }
}