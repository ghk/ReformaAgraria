using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MicrovacWebCore;
using ReformaAgraria.Models;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/Event")]
    [Authorize(Policy = "Bearer")]
    public class EventController : CrudController<Event, int>
    {
        public EventController(ReformaAgrariaDbContext dbContext): base(dbContext) { }
    }
}