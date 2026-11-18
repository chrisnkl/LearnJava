using LearnJava.Web.Domain.Entities;

namespace LearnJava.Web.Services.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(Student student);
}
