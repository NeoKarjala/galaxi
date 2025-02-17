using Microsoft.AspNetCore.Mvc;
using GaLaXiBackend.Data;
using GaLaXiBackend.Models;

namespace GaLaXiBackend.Controllers
{
    [Route("api/bookings")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/bookings
        [HttpGet]
        public IActionResult GetAllBookings()
        {
            var bookings = _context.Bookings.ToList();
            return Ok(bookings);
        }

        // POST: api/bookings
        [HttpPost]
        public IActionResult CreateBooking([FromBody] Booking booking)
        {
            if (booking == null)
            {
                return BadRequest("Booking data is required.");
            }

            if (!_context.Users.Any(u => u.Id == booking.UserId))
            {
                return BadRequest("Invalid User ID.");
            }

            _context.Bookings.Add(booking);
            _context.SaveChanges();
            return Ok(new { message = "Booking created successfully.", booking });
        }

        // PUT: api/bookings/{id}
        [HttpPut("{id}")]
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
            existingBooking.Location = updatedBooking.Location;

            _context.SaveChanges();
            return Ok("Booking updated successfully.");
        }

        // DELETE: api/bookings/{id}
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
