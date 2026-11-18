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
public class QuizController : ControllerBase
{
    private readonly IQuizService _quizService;

    public QuizController(IQuizService quizService)
    {
        _quizService = quizService;
    }

    [HttpPost("submit")]
    [ProducesResponseType(typeof(ApiResponse<QuizSubmissionResultResponse>), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), (int)HttpStatusCode.Unauthorized)]
    public async Task<ActionResult<ApiResponse<QuizSubmissionResultResponse>>> SubmitQuiz(
        [FromBody] QuizSubmissionRequest request,
        CancellationToken cancellationToken)
    {
        var studentId = User.GetStudentId();
        var result = await _quizService.SubmitQuizAsync(studentId, request, cancellationToken);
        return Ok(ApiResponse.Of(HttpStatusCode.OK, "Quiz evaluated successfully.", result));
    }
}
