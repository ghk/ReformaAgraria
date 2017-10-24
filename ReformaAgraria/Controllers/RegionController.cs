using System;
using System.Collections.Generic;
using System.Linq;
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

    }
}