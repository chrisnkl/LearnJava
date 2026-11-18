using System.Net;
using LearnJava.Web.API.Extensions;
using LearnJava.Web.Services.DTOs;
using LearnJava.Web.Services.DTOs.Requests;
using LearnJava.Web.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnJava.Web.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v{version:int}/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpPost("interaction")]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult<ApiResponse>> TrackInteraction(
        [FromBody] TrackInteractionRequest request,
        CancellationToken cancellationToken)
    {
        var studentId = User.GetStudentId();
        await _analyticsService.TrackInteractionAsync(studentId, request, cancellationToken);
        return Ok(ApiResponse.Of(HttpStatusCode.OK, "Telemetry interaction tracked successfully."));
    }

    [HttpPost("feedback")]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult<ApiResponse>> SubmitFeedback(
        [FromBody] SubmitFeedbackRequest request,
        CancellationToken cancellationToken)
    {
        var studentId = User.GetStudentId();
        await _analyticsService.SubmitFeedbackAsync(studentId, request, cancellationToken);
        return Ok(ApiResponse.Of(HttpStatusCode.OK, "Lesson feedback recorded successfully."));
    }
}
