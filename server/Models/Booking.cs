using System;
using System.ComponentModel.DataAnnotations;

namespace GaLaXiBackend.Models
{
    public class Booking
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid(); // Unique identifier for the booking

        [Required]
        public Guid UserId { get; set; } // The user who made the booking

        [Required]
        public string Description { get; set; } // Booking details

        [Required]
        public DateTime StartTime { get; set; } // Booking start time

        [Required]
        public DateTime EndTime { get; set; } // Booking end time

        [Required]
        public string Location { get; set; } // Location of booking

        [Required]
        [Range(1, 5, ErrorMessage = "ComputerId must be between 1 and 5.")]
        public int ComputerId { get; set; } // The selected computer (1-5)

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Timestamp of booking creation
    }
}
