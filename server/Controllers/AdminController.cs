using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GaLaXiBackend.Data;
using GaLaXiBackend.Models;

namespace GaLaXiBackend.Controllers
{
    /// <summary>
    /// Controller for admin operations, allowing management of users and bookings.
    /// Only accessible to authenticated admin users.
    /// </summary>
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "admin")] // ✅ Ensures only admin users can access these routes
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves a list of all users in the system.
        /// </summary>
        /// <returns>List of users</returns>
        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }

        /// <summary>
        /// Retrieves a list of all bookings in the system.
        /// </summary>
        /// <returns>List of bookings</returns>
        [HttpGet("bookings")]
        public IActionResult GetAllBookings()
        {
            var bookings = _context.Bookings.ToList();
            return Ok(bookings);
        }

        /// <summary>
        /// Updates any booking in the system.
        /// Ensures updated details are valid.
        /// </summary>
        /// <param name="id">Booking ID</param>
        /// <param name="updatedBooking">Updated booking details</param>
        /// <returns>Success message or error</returns>
        [HttpPut("bookings/{id}")]
        public IActionResult UpdateBooking(Guid id, [FromBody] Booking updatedBooking)
        {
            var existingBooking = _context.Bookings.FirstOrDefault(b => b.Id == id);
            if (existingBooking == null)
            {
                return NotFound("Booking not found.");
            }

            existingBooking.Description = updatedBooking.Description;
            existingBooking.StartTime = updatedBooking.StartTime;
            existingBooking.EndTime = updatedBooking.EndTime;
            existingBooking.IsRoomBooking = updatedBooking.IsRoomBooking;

            if (updatedBooking.IsRoomBooking)
            {
                if (string.IsNullOrEmpty(updatedBooking.RoomBookingType) ||
                    (updatedBooking.RoomBookingType != "private" && updatedBooking.RoomBookingType != "public"))
                {
                    return BadRequest("Invalid room booking type. Must be 'private' or 'public'.");
                }

                existingBooking.RoomBookingType = updatedBooking.RoomBookingType;
                existingBooking.ComputerId = null; // Clear computer ID when booking a room
            }
            else
            {
                if (!updatedBooking.ComputerId.HasValue || updatedBooking.ComputerId < 1 || updatedBooking.ComputerId > 5)
                {
                    return BadRequest("Invalid ComputerId. Must be between 1 and 5.");
                }

                existingBooking.ComputerId = updatedBooking.ComputerId;
                existingBooking.RoomBookingType = null; // Clear room booking type when booking a computer
            }

            _context.SaveChanges();
            return Ok("Booking updated successfully.");
        }

        /// <summary>
        /// Deletes a booking by ID.
        /// </summary>
        /// <param name="id">Booking ID</param>
        /// <returns>Success message or error if the booking is not found</returns>
        [HttpDelete("bookings/{id}")]
        public IActionResult DeleteBooking(Guid id)
        {
            var booking = _context.Bookings.FirstOrDefault(b => b.Id == id);
            if (booking == null)
            {
                return NotFound("Booking not found.");
            }

            _context.Bookings.Remove(booking);
            _context.SaveChanges();
            return Ok("Booking deleted successfully.");
        }

        /// <summary>
        /// Deletes a user by ID.
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>Success message or error</returns>
        [HttpDelete("users/{id}")]
        public IActionResult DeleteUser(Guid id)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            _context.Users.Remove(user);
            _context.SaveChanges();
            return Ok("User deleted successfully.");
        }
    }
}
