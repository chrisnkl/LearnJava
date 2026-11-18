using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LearnJava.Web.Domain.Entities;
using LearnJava.Web.Services.Interfaces;
using LearnJava.Web.Services.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace LearnJava.Web.Services.Services;

public class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly JwtOptions _jwtOptions;

    public JwtTokenGenerator(IOptions<JwtOptions> jwtOptions)
    {
        _jwtOptions = jwtOptions.Value;
    }

    public string GenerateToken(Student student)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, student.Id.ToString()),
            new(ClaimTypes.NameIdentifier, student.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, student.Email),
            new(ClaimTypes.Email, student.Email),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        if (!string.IsNullOrWhiteSpace(student.FirstName))
        {
            claims.Add(new(ClaimTypes.GivenName, student.FirstName));
        }

        if (!string.IsNullOrWhiteSpace(student.LastName))
        {
            claims.Add(new(ClaimTypes.Surname, student.LastName));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_jwtOptions.ExpirationInMinutes),
            Issuer = _jwtOptions.Issuer,
            Audience = _jwtOptions.Audience,
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var securityToken = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(securityToken);
    }
}
