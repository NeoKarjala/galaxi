using Microsoft.AspNetCore.Mvc;
using GaLaXiBackend.Data;
using GaLaXiBackend.Models;

namespace GaLaXiBackend.Controllers
{
    /// <summary>
    /// Controller for managing bookings in the GaLaXi system.
    /// Provides endpoints to create, retrieve, update, and delete bookings.
    /// Ensures that computers cannot be double-booked for overlapping time slots.
    /// </summary>
    [Route("api/bookings")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        /// <summary>
        /// Constructor that initializes the database context.
        /// </summary>
        /// <param name="context">Database context</param>
        public BookingController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all bookings from the database.
        /// </summary>
        /// <returns>A list of all bookings</returns>
        [HttpGet]
        public IActionResult GetAllBookings(
              [FromQuery] Guid? userId,
              [FromQuery] DateTime? startDate,
              [FromQuery] DateTime? endDate,
              [FromQuery] string? location,
              [FromQuery] int page = 1,
              [FromQuery] int pageSize = 10)
        {
            var query = _context.Bookings.AsQueryable();

            if (userId.HasValue)
            {
                query = query.Where(b => b.UserId == userId.Value);
            }

            if (startDate.HasValue && endDate.HasValue)
            {
                query = query.Where(b => b.StartTime >= startDate.Value && b.EndTime <= endDate.Value);
            }

            if (!string.IsNullOrEmpty(location))
            {
                query = query.Where(b => b.Location == location);
            }

            // Apply pagination
            var totalRecords = query.Count();
            var bookings = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return Ok(new
            {
                TotalRecords = totalRecords,
                Page = page,
                PageSize = pageSize,
                Data = bookings
            });
        }



        /// <summary>
        /// Creates a new booking.
        /// Ensures the selected computer is not already booked during the same time slot.
        /// </summary>
        /// <param name="booking">Booking details received from request body</param>
        /// <returns>Success message or an error if the booking conflicts</returns>
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

            // Check if the selected computer is already booked for the given time slot
            bool isAlreadyBooked = _context.Bookings.Any(b =>
                b.ComputerId == booking.ComputerId &&
                ((b.StartTime < booking.EndTime && b.EndTime > booking.StartTime))
            );

            if (isAlreadyBooked)
            {
                return BadRequest("This computer is already booked for the selected time.");
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
        /// <returns>Success message or error if the booking is not found</returns>
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
            existingBooking.ComputerId = updatedBooking.ComputerId; // Ensure computer selection is updated

            _context.SaveChanges();
            return Ok("Booking updated successfully.");
        }

        /// <summary>
        /// Deletes a booking by ID.
        /// </summary>
        /// <param name="id">Booking ID</param>
        /// <returns>Success message or error if the booking is not found</returns>
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
