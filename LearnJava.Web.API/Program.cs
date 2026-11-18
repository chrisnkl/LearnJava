using System.Text;
using LearnJava.Web.API.Infrastructure;
using LearnJava.Web.Services.Common.Security;
using LearnJava.Web.Services.Interfaces;
using LearnJava.Web.Services.Options;
using LearnJava.Web.Services.Repositories;
using LearnJava.Web.Services.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));

builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IStudentRepository, SqlStudentRepository>();
builder.Services.AddScoped<ILessonRepository, SqlLessonRepository>();
builder.Services.AddScoped<IMisconceptionRepository, SqlMisconceptionRepository>();
builder.Services.AddScoped<IAnalyticsRepository, SqlAnalyticsRepository>();

builder.Services.AddScoped<IAdaptiveInferenceEngine, AdaptiveInferenceEngine>();
builder.Services.AddScoped<ILessonService, LessonService>();
builder.Services.AddScoped<IQuizService, QuizService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddCors(options =>
{
    
    options.AddPolicy("CORSPolicy", policy =>
    {
        policy.WithOrigins(
                builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                ?? ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var jwtSecret = builder.Configuration["Jwt:Secret"] 
    ?? throw new InvalidOperationException("Jwt:Secret configuration is missing.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "LearnJava.Web.API";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "LearnJava.Client";

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddOpenApi();
builder.Services.AddControllers();

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("CORSPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();