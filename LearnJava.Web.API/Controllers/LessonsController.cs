using System.Net;
using LearnJava.Web.API.Extensions;
using LearnJava.Web.Services.DTOs;
using LearnJava.Web.Services.DTOs.Responses;
using LearnJava.Web.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnJava.Web.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v{version:int}/[controller]")]
public class LessonsController : ControllerBase
{
    private readonly ILessonService _lessonService;

    public LessonsController(ILessonService lessonService)
    {
        _lessonService = lessonService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<LessonSummaryResponse>>), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<LessonSummaryResponse>>>> GetAllLessons(
        CancellationToken cancellationToken)
    {
        var studentId = User.GetStudentId();
        var lessons = await _lessonService.GetLessonsAsync(studentId, cancellationToken);
        return Ok(ApiResponse.Of(HttpStatusCode.OK, "Lessons retrieved successfully.", lessons));
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<LessonDetailResponse>), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult<ApiResponse<LessonDetailResponse>>> GetLessonById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var studentId = User.GetStudentId();
        var lesson = await _lessonService.GetLessonDetailAsync(id, studentId, cancellationToken);
        return Ok(ApiResponse.Of(HttpStatusCode.OK, "Adaptive lesson content retrieved successfully.", lesson));
    }

    [HttpGet("{id:guid}/quiz")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<QuizQuestionResponse>>), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.NotFound)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<QuizQuestionResponse>>>> GetLessonQuiz(
        Guid id,
        CancellationToken cancellationToken)
    {
        var questions = await _lessonService.GetQuizQuestionsAsync(id, cancellationToken);
        return Ok(ApiResponse.Of(HttpStatusCode.OK, "Lesson quiz questions retrieved successfully.", questions));
    }
}
