using GaLaXiBackend.Data;
using GaLaXiBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace GaLaXiBackend.Controllers
{
    // Defines this controller as handling authentication-related requests
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Constructor that injects the database context
        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Registers a new user in the system.
        /// </summary>
        /// <param name="user">User data from the request body</param>
        /// <returns>Success or error message</returns>
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            // Check if the email is already registered
            if (_context.Users.Any(u => u.Email == user.Email))
                return BadRequest("Email is already in use.");

            // Add the new user to the database
            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("User registered successfully.");
        }
    }
}
