using Microsoft.AspNetCore.Mvc;
using GaLaXiBackend.Data;
using GaLaXiBackend.Models;

namespace GaLaXiBackend.Controllers
{
    /// <summary>
    /// API Controller for managing bookings.
    /// </summary>
    [Route("api/bookings")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        /// <summary>
        /// Constructor injecting the database context.
        /// </summary>
        /// <param name="context">Application database context</param>
        public BookingController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all bookings from the database.
        /// </summary>
        /// <returns>List of bookings</returns>
        [HttpGet]
        public IActionResult GetAllBookings()
        {
            var bookings = _context.Bookings.ToList();
            return Ok(bookings);
        }

        /// <summary>
        /// Creates a new booking.
        /// </summary>
        /// <param name="booking">Booking details sent in the request body</param>
        /// <returns>Success or error message</returns>
        [HttpPost]
        public IActionResult CreateBooking([FromBody] Booking booking)
        {
            if (booking == null)
            {
                return BadRequest("Booking data is required.");
            }

            // Ensure the UserId exists before allowing the booking
            if (!_context.Users.Any(u => u.Id == booking.UserId))
            {
                return BadRequest("Invalid User ID.");
            }

            _context.Bookings.Add(booking);
            _context.SaveChanges();
            return Ok(new { message = "Booking created successfully.", booking });
        }

        /// <summary>
        /// Updates an existing booking.
        /// </summary>
        /// <param name="id">Booking ID</param>
        /// <param name="updatedBooking">Updated booking details</param>
        /// <returns>Success or error message</returns>
        [HttpPut("{id}")]
        public IActionResult UpdateBooking(Guid id, [FromBody] Booking updatedBooking)
        {
            var existingBooking = _context.Bookings.FirstOrDefault(b => b.Id == id);
            if (existingBooking == null)
            {
                return NotFound("Booking not found.");
            }

            // Update booking details
            existingBooking.Description = updatedBooking.Description;
            existingBooking.StartTime = updatedBooking.StartTime;
            existingBooking.EndTime = updatedBooking.EndTime;
            existingBooking.Location = updatedBooking.Location;

            _context.SaveChanges();
            return Ok("Booking updated successfully.");
        }

        /// <summary>
        /// Deletes a booking by ID.
        /// </summary>
        /// <param name="id">Booking ID</param>
        /// <returns>Success or error message</returns>
        [HttpDelete("{id}")]
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
    }
}
