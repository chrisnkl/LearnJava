using Microsoft.AspNetCore.Mvc;

namespace LearnJava.Web.API.Controllers;

[ApiController]
[Route("api/v{version:int}/[controller]")]
public class StatusController
{

    [HttpGet] public ActionResult<string> Get () => "OK";

}