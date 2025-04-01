using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GaLaXiBackend.Data;
using GaLaXiBackend.Models;

namespace GaLaXiBackend.Controllers
{
    [Route("api/bookings")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class AdminBookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminBookingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /api/bookings
        [HttpGet]
        public IActionResult GetAllBookings()
        {
            var bookings = _context.Bookings.ToList();
            return Ok(bookings);
        }

        // GET: /api/bookings/{id}
        [HttpGet("{id}")]
        public IActionResult GetBookingById(Guid id)
        {
            var booking = _context.Bookings.FirstOrDefault(b => b.Id == id);
            if (booking == null)
                return NotFound("Booking not found.");

            return Ok(booking);
        }

        // PUT: /api/bookings/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateBooking(Guid id, [FromBody] Booking updatedBooking)
        {
            var existingBooking = _context.Bookings.FirstOrDefault(b => b.Id == id);
            if (existingBooking == null)
                return NotFound("Booking not found.");

            existingBooking.Description = updatedBooking.Description;
            existingBooking.StartTime = updatedBooking.StartTime;
            existingBooking.EndTime = updatedBooking.EndTime;
            existingBooking.ComputerId = updatedBooking.ComputerId;
            existingBooking.IsRoomBooking = updatedBooking.IsRoomBooking;
            existingBooking.RoomBookingType = updatedBooking.RoomBookingType;

            _context.SaveChanges();
            return Ok("Booking updated successfully.");
        }

        // DELETE: /api/bookings/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteBooking(Guid id)
        {
            var booking = _context.Bookings.FirstOrDefault(b => b.Id == id);
            if (booking == null)
                return NotFound("Booking not found.");

            _context.Bookings.Remove(booking);
            _context.SaveChanges();
            return Ok("Booking deleted successfully.");
        }
    }
}
