﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MicrovacWebCore;
using ReformaAgraria.Models;
using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/Event")]
    [Authorize(Policy = "Bearer")]
    public class EventController : CrudControllerAsync<Event, int>
    {
        private readonly ILogger<EventController> _logger;

        public EventController(
            ReformaAgrariaDbContext dbContext,
            ILogger<EventController> logger
        ) : base(dbContext)
        {
            this._logger = logger;
        }

        protected override IQueryable<Event> ApplyQuery(IQueryable<Event> query)
        {
            var type = GetQueryString<string>("type");

            if (type == "getAllByRegion")
            {
                var regionId = GetQueryString<string>("regionId");
                if (!string.IsNullOrWhiteSpace(regionId))
                    query = query.Where(e => e.FkRegionId == regionId);
            }

            if (type == "getAllByParent")
            {
                var parentId = GetQueryString<string>("parentId");
                var startDate = GetQueryString<string>("startDate");

                if (!string.IsNullOrWhiteSpace(parentId))
                    query = query.Where(e => e.FkRegionId.StartsWith(parentId)).Include(e => e.Region);

                if (!string.IsNullOrWhiteSpace(startDate))
                {
                    try
                    {
                        var date = DateTime.ParseExact(startDate, "dd/MM/yyyy", CultureInfo.CurrentCulture);
                        var utcDate = date.ToUniversalTime();
                        query = query.Where(e => e.StartDate >= utcDate);
                    }
                    catch (FormatException ex)
                    {
                        _logger.LogError(ex, "DateTime Parse Error");
                    }
                }
            }

            query = query.Include(e => e.EventType);

            return query;
        }
    }
}