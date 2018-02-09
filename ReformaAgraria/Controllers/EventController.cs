using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MicrovacWebCore;
using ReformaAgraria.Helpers;
using ReformaAgraria.Models;
using ReformaAgraria.Models.ViewModels;
using System;
using System.Globalization;
using System.IO;
using System.Linq;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/Event")]
    [Authorize(Policy = "Bearer")]
    public class EventController : CrudControllerAsync<Event, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ILogger<EventController> _logger;

        public EventController(
            ReformaAgrariaDbContext dbContext,
            IHostingEnvironment hostingEnvironment,
            ILogger<EventController> logger
        ) : base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _logger = logger;
        }

        [HttpPost("upload")]
        public string Upload([FromForm]UploadEventDetailViewModel document)
        {
            var eventDirectoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "event");
            var eventFilePath = Path.Combine(eventDirectoryPath, document.EventId, document.UploadType.ToLower(), document.File.FileName);

            using (var stream = document.File.OpenReadStream())
            {
                IOHelper.StreamCopy(eventFilePath, document.File);
            }

            return "Success";
        }

        [HttpGet("documents")]
        public string[] GetDocumentsNames([FromQuery]string id, [FromQuery]string type)
        {
            var eventFilePath = Path.Combine(_hostingEnvironment.WebRootPath, "event", id, type.ToLower());
            var results = Directory.GetFiles(eventFilePath).Select(Path.GetFileName).ToArray();
            return results;
        }

        [HttpDelete("attachments")]
        public string DeleteAttachment([FromQuery]string id, [FromQuery]string attachment)
        {
            var eventFilePath = Path.Combine(_hostingEnvironment.WebRootPath, "event", id, "attachment", attachment);
            if (System.IO.File.Exists(eventFilePath))
            {
                System.IO.File.Delete(eventFilePath);
                return "Success";
            }
            return "Failed";
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