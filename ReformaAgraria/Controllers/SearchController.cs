using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReformaAgraria.Models.ViewModels;
using Microsoft.EntityFrameworkCore;
using ReformaAgraria.Models;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    //[Authorize(Policy = "Bearer")]
    public class SearchController : ControllerBase
    {
        protected DbContext dbContext;

        public SearchController(ReformaAgrariaDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("{keywords}")]
        public async Task<List<SearchViewModel>> Search(string keywords)
        {
            var result = new List<SearchViewModel>();
            var regions = await dbContext.Set<Region>()
                .Where(r => r.Id.StartsWith("72.1"))
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

            return result.OrderBy(x => x.Label).ToList();
        }
    }
}