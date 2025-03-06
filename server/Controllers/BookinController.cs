using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GaLaXiBackend.Data;
using GaLaXiBackend.Models;

namespace GaLaXiBackend.Controllers
{
    /// <summary>
    /// Controller for managing bookings in the GaLaXi system.
    /// Provides endpoints to create, retrieve, update, and delete bookings.
    /// Ensures that computers cannot be double-booked and allows room reservations.
    /// </summary>
    [Route("api/bookings")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookingController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all bookings from the database.
        /// </summary>
        /// <returns>A list of all bookings</returns>
        [HttpGet]
        public IActionResult GetAllBookings()
        {
            var bookings = _context.Bookings.ToList();
            return Ok(bookings);
        }

        /// <summary>
        /// Creates a new booking.
        /// Ensures correct booking type (computer or room) and prevents double-booking conflicts.
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

            // Ensure booking type is correctly set
            if (booking.IsRoomBooking)
            {
                if (string.IsNullOrEmpty(booking.RoomBookingType) ||
                    (booking.RoomBookingType != "private" && booking.RoomBookingType != "public"))
                {
                    return BadRequest("Invalid room booking type. Must be 'private' or 'public'.");
                }

                // Check if the entire gaming room is already booked at the given time
                bool isRoomAlreadyBooked = _context.Bookings.Any(b =>
                    b.IsRoomBooking &&
                    ((b.StartTime < booking.EndTime && b.EndTime > booking.StartTime))
                );

                if (isRoomAlreadyBooked)
                {
                    return BadRequest("The gaming room is already booked for the selected time.");
                }

                // Clear ComputerId if booking the whole room
                booking.ComputerId = null;
            }
            else
            {
                if (!booking.ComputerId.HasValue || booking.ComputerId < 1 || booking.ComputerId > 5)
                {
                    return BadRequest("Invalid ComputerId. Must be between 1 and 5.");
                }

                // Check if the selected computer is already booked
                bool isComputerAlreadyBooked = _context.Bookings.Any(b =>
                    b.ComputerId == booking.ComputerId &&
                    ((b.StartTime < booking.EndTime && b.EndTime > booking.StartTime))
                );

                if (isComputerAlreadyBooked)
                {
                    return BadRequest("This computer is already booked for the selected time.");
                }

                // Clear RoomBookingType if booking a computer
                booking.RoomBookingType = null;
            }

            _context.Bookings.Add(booking);
            _context.SaveChanges();
            return Ok(new { message = "Booking created successfully.", booking });
        }

        /// <summary>
        /// Updates an existing booking.
        /// Ensures updated details are valid.
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
