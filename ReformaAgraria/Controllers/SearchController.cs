using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReformaAgraria.Models;
using ReformaAgraria.Models.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    //[Authorize(Policy = "Bearer")]
    public class SearchController : ControllerBase
    {
        protected DbContext dbContext;
        private readonly ILogger<SearchController> _logger;

        public SearchController(ReformaAgrariaDbContext dbContext, ILogger<SearchController> logger)
        {
            this.dbContext = dbContext;
            _logger = logger;
        }

        [HttpGet("{keywords}")]
        public async Task<List<SearchViewModel>> Search(string keywords)
        {
            var result = new List<SearchViewModel>();

            var regionResult = await SearchByRegion(keywords);
            result.AddRange(regionResult);

            var toraObjectResult = await SearchByToraObject(keywords);
            result.AddRange(toraObjectResult);

            return result.OrderBy(x => x.Label).ToList();
        }

        [HttpGet("region/{keywords}")]
        public async Task<List<SearchViewModel>> SearchRegion(string keywords)
        {
            var result = await SearchByRegion(keywords);
            return result;
        }

        private async Task<List<SearchViewModel>> SearchByRegion(string keywords)
        {
            var result = new List<SearchViewModel>();
            var regions = await dbContext.Set<Region>()
                .Where(r => r.Id == "72.1" || r.Id.StartsWith("72.10"))
                .Where(r => EF.Functions.Like(r.Name.ToLower(), string.Format("{0}%", keywords.ToLower())))
                .ToListAsync();

            foreach (var region in regions)
            {
                SearchType type;
                switch (region.Type)
                {
                    case RegionType.Kabupaten:
                        type = SearchType.Kabupaten;
                        break;

                    case RegionType.Kecamatan:
                        type = SearchType.Kecamatan;
                        break;

                    default:
                        type = SearchType.Desa;
                        break;
                }

                var searchViewModel = new SearchViewModel()
                {
                    Label = region.Name,
                    Value = region.Id,
                    Type = type
                };

                result.Add(searchViewModel);
            }

            return result;
        }

        private async Task<List<SearchViewModel>> SearchByToraObject(string keywords)
        {
            var result = new List<SearchViewModel>();
            var toraObjects = await dbContext.Set<ToraObject>()
                .Where(t => EF.Functions.Like(t.Name.ToLower(), string.Format("{0}%", keywords.ToLower())))
                .ToListAsync();

            foreach (var to in toraObjects)
            {
                var searchViewModel = new SearchViewModel()
                {
                    Label = to.Name,
                    Value = to.Id.ToString(),
                    Type = SearchType.ToraObject
                };

                result.Add(searchViewModel);
            }

            return result;
        }
    }
}