using System.Net;
using System.Security.Authentication;
using System.Security.Claims;
using LearnJava.Web.Services.DTOs;
using LearnJava.Web.Services.DTOs.Requests;
using LearnJava.Web.Services.DTOs.Responses;
using LearnJava.Web.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnJava.Web.API.Controllers;

[ApiController]
[Route("api/v{version:int}/[controller]")]
public class AuthController : ControllerBase
{

    private readonly IAuthService _authService;
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
    
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.BadRequest)]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] AuthRequest request)
    {
        var response = await _authService.LoginAsync(request);
        return Ok(ApiResponse.Of(HttpStatusCode.OK, "You have been logged in successfully.", response));
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), (int)HttpStatusCode.Created)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.BadRequest)]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register([FromBody] AuthRequest request)
    {
        var response = await _authService.RegisterAsync(request);
        return StatusCode(
            (int)HttpStatusCode.Created,
            ApiResponse.Of(HttpStatusCode.Created, "You have registered successfully.", response)
        );
    }

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(ApiResponse<object>), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult<ApiResponse<StudentProfileResponse>>> GetCurrentUser(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) throw new AuthenticationException("User is not authenticated.");
        
        StudentProfileResponse student = await _authService.GetLoggedInStudent(userId, cancellationToken);
        
        return Ok(ApiResponse.Of(
            HttpStatusCode.OK,
            "Authenticated user retrieved successfully.",
            student
        ));
    }
}
