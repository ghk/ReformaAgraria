using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MicrovacWebCore;
using ReformaAgraria.Models;
using System.Globalization;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/Event")]
    [Authorize(Policy = "Bearer")]
    public class EventController : CrudControllerAsync<Event, int>
    {
        public EventController(ReformaAgrariaDbContext dbContext): base(dbContext) { }

        protected override IQueryable<Event> ApplyQuery(IQueryable<Event> query)
        {
            var type = GetQueryString<string>("type");

            if (type == "getAllByRegion")
            {
                var regionId = GetQueryString<string>("regionId");
                if (!string.IsNullOrWhiteSpace(regionId))
                    query = query.Where(to => to.FkRegionId == regionId);
            }

            if (type == "getAllByParent")
            {
                var parentId = GetQueryString<string>("parentId");
                var startDate = GetQueryString<string>("startDate");
                if (!string.IsNullOrWhiteSpace(parentId))
                    query = query.Where(to => to.FkRegionId.StartsWith(parentId));
                if (!string.IsNullOrWhiteSpace(startDate))
                {
                    try
                    {
                        DateTime date = DateTime.ParseExact(startDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                        query = query.Where(to => to.StartDate >= date);
                    }
                    catch (FormatException ex)
                    {
                        // TODO: LOG
                    }
                }
            }

            return query;
        }
    }
}