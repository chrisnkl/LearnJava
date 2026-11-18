using System.Net;
using LearnJava.Web.API.Extensions;
using LearnJava.Web.Services.DTOs;
using LearnJava.Web.Services.DTOs.Requests;
using LearnJava.Web.Services.DTOs.Responses;
using LearnJava.Web.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnJava.Web.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v{version:int}/[controller]")]
public class StudentController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpGet("profile")]
    [ProducesResponseType(typeof(ApiResponse<StudentProfileResponse>), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult<ApiResponse<StudentProfileResponse>>> GetProfile(CancellationToken cancellationToken)
    {
        var studentId = User.GetStudentId();
        var profile = await _studentService.GetProfileAsync(studentId, cancellationToken);
        return Ok(ApiResponse.Of(HttpStatusCode.OK, "Student profile retrieved successfully.", profile));
    }

    [HttpPut("preferences")]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult<ApiResponse>> UpdatePreferences(
        [FromBody] UpdatePreferencesRequest request,
        CancellationToken cancellationToken)
    {
        var studentId = User.GetStudentId();
        await _studentService.UpdatePreferencesAsync(studentId, request, cancellationToken);
        return Ok(ApiResponse.Of(HttpStatusCode.OK, "Learning preferences updated successfully."));
    }

    [HttpGet("history")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<QuizAttemptDto>>), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<QuizAttemptDto>>>> GetQuizHistory(
        [FromQuery] int take = 20,
        CancellationToken cancellationToken = default)
    {
        var studentId = User.GetStudentId();
        var history = await _studentService.GetQuizHistoryAsync(studentId, take, cancellationToken);
        return Ok(ApiResponse.Of(HttpStatusCode.OK, "Quiz history retrieved successfully.", history));
    }
}
