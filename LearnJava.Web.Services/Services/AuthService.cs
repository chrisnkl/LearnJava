using LearnJava.Web.Domain.Entities;
using LearnJava.Web.Domain.Exceptions;
using LearnJava.Web.Services.Common.Security;
using LearnJava.Web.Services.DTOs.Requests;
using LearnJava.Web.Services.DTOs.Responses;
using LearnJava.Web.Services.Interfaces;
using LearnJava.Web.Services.Repositories;

namespace LearnJava.Web.Services.Services;

public class AuthService : IAuthService
{
    private readonly IStudentRepository _studentRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        IStudentRepository studentRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _studentRepository = studentRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponse> RegisterAsync(AuthRequest request)
    {
        if (await _studentRepository.ExistsByEmailAsync(request.Email))
        {
            throw new ValidationException($"A user with email '{request.Email}' already exists.");
        }

        var passwordHash = _passwordHasher.Hash(request.Password);

        var student = new Student
        {
            Email = request.Email,
            PasswordHash = passwordHash,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _studentRepository.AddAsync(student);

        var token = _jwtTokenGenerator.GenerateToken(student);
        return new AuthResponse(token);
    }

    public async Task<AuthResponse> LoginAsync(AuthRequest request)
    {
        var student = await _studentRepository.GetByEmailAsync(request.Email);
        if (student is null)
        {
            throw new AuthenticationException("Invalid email or password.");
        }

        var isPasswordValid = _passwordHasher.Verify(request.Password, student.PasswordHash);
        if (!isPasswordValid)
        {
            throw new AuthenticationException("Invalid email or password.");
        }

        var token = _jwtTokenGenerator.GenerateToken(student);
        return new AuthResponse(token);
    }

    public async Task<StudentProfileResponse> GetLoggedInStudent(string studentId, CancellationToken cancellationToken = default)
    {

        if (string.IsNullOrEmpty(studentId) || !Guid.TryParse(studentId, out var studentGuid))
        {
            throw new AuthenticationException("Invalid or missing studentId");
        }

        var student = await _studentRepository.GetByIdAsync(studentGuid, cancellationToken);
    
        if (student is null) throw new AuthenticationException("Student was not found");
        
        return new StudentProfileResponse(
            student.Id,
            student.Email,
            student.FirstName,
            student.LastName,
            student.PreferredLearningStyle,
            student.CurrentStereotype,
            student.TotalLessonsCompleted,
            student.TotalLessonsAttempted,
            student.TotalQuestionsAnswered,
            student.TotalQuestionsCorrect,
            student.CurrentStreak,
            student.HighestStreak,
            student.AccuracyCorrectQuestionsPercentage,
            ActiveMisconceptions: [],
            ActiveRecommendations: []
        );
        
    }
}
