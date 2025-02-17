using GaLaXiBackend.Data;
using GaLaXiBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace GaLaXiBackend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            if (_context.Users.Any(u => u.Email == user.Email))
                return BadRequest("Email is already in use.");

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("User registered successfully.");
        }
    }
}
