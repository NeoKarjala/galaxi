using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GaLaXiBackend.Data;
using GaLaXiBackend.Models;

namespace GaLaXiBackend.Controllers
{
    /// <summary>
    /// Controller for user authentication and JWT token generation.
    /// </summary>
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        /// <summary>
        /// Authenticates a user and generates a JWT token.
        /// </summary>
        /// <param name="loginRequest">User login details</param>
        /// <returns>JWT token if authentication is successful</returns>
        [HttpPost("login")]
        public IActionResult Login([FromBody] User loginRequest)
        {
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Email))
            {
                return BadRequest("Invalid login request.");
            }

            var user = _context.Users.FirstOrDefault(u => u.Email == loginRequest.Email);
            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            // Ensure JWT key is valid
            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new Exception("JWT Key is missing from configuration.");
            }

            // Generate JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(jwtKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(Convert.ToDouble(_configuration["Jwt:ExpiryInHours"] ?? "2")),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { Token = tokenString, Role = user.Role });
        }

        /// <summary>
        /// Registers a new user in the system.
        /// </summary>
        /// <param name="user">User registration details</param>
        /// <returns>Success message or error</returns>
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            if (_context.Users.Any(u => u.Email == user.Email))
            {
                return BadRequest("Email is already in use.");
            }

            // Default role is "user", unless specified otherwise
            user.Role = user.Role ?? "user";

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("User registered successfully.");
        }
    }
}
