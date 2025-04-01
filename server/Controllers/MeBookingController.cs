using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using GaLaXiBackend.Data;
using GaLaXiBackend.Models;
using GaLaXiBackend.Models.Dtos;

namespace GaLaXiBackend.Controllers
{
    [Route("api/me/bookings")]
    [ApiController]
    [Authorize(Roles = "user")]
    public class MeBookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MeBookingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetMyBookings()
        {
            var userId = GetUserId();
            var myBookings = _context.Bookings
                .Where(b => b.UserId == userId)
                .Select(b => new BookingResponseDto
                {
                    Id = b.Id,
                    Description = b.Description,
                    StartTime = b.StartTime,
                    EndTime = b.EndTime,
                    ComputerId = b.ComputerId,
                    IsRoomBooking = b.IsRoomBooking,
                    RoomBookingType = b.RoomBookingType
                })
                .ToList();

            return Ok(myBookings);
        }

        [HttpPost]
        public IActionResult CreateBooking([FromBody] CreateBookingDto dto)
        {
            var userId = GetUserId();

            if (dto == null)
                return BadRequest("Booking data is required.");

            if (dto.ComputerId.HasValue)
            {
                var overlap = _context.Bookings.Any(b =>
                    b.ComputerId == dto.ComputerId &&
                    b.StartTime < dto.EndTime &&
                    b.EndTime > dto.StartTime);

                if (overlap)
                    return BadRequest("This computer is already booked for the selected time.");
            }

            if (dto.IsRoomBooking)
            {
                var roomOverlap = _context.Bookings.Any(b =>
                    b.IsRoomBooking &&
                    b.StartTime < dto.EndTime &&
                    b.EndTime > dto.StartTime);

                if (roomOverlap)
                    return BadRequest("The gaming room is already booked for the selected time.");
            }

            var booking = new Booking
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Description = dto.Description,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                ComputerId = dto.ComputerId,
                IsRoomBooking = dto.IsRoomBooking,
                RoomBookingType = dto.RoomBookingType,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            _context.SaveChanges();

            return Ok(new { message = "Booking created successfully.", booking.Id });
        }

        [HttpPut("{id}")]
        public IActionResult UpdateMyBooking(Guid id, [FromBody] UpdateBookingDto dto)
        {
            var userId = GetUserId();
            var booking = _context.Bookings.FirstOrDefault(b => b.Id == id && b.UserId == userId);

            if (booking == null)
                return NotFound("Booking not found or not authorized.");

            booking.Description = dto.Description;
            booking.StartTime = dto.StartTime;
            booking.EndTime = dto.EndTime;
            booking.ComputerId = dto.ComputerId;
            booking.IsRoomBooking = dto.IsRoomBooking;
            booking.RoomBookingType = dto.RoomBookingType;

            _context.SaveChanges();

            return Ok("Booking updated successfully.");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMyBooking(Guid id)
        {
            var userId = GetUserId();
            var booking = _context.Bookings.FirstOrDefault(b => b.Id == id && b.UserId == userId);

            if (booking == null)
                return NotFound("Booking not found or not authorized.");

            _context.Bookings.Remove(booking);
            _context.SaveChanges();

            return Ok("Booking deleted successfully.");
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.Name);
            return Guid.Parse(userIdClaim!.Value);
        }
    }
}
