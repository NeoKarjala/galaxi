using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaLaXiBackend.Models
{
    public class Booking
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid(); // Unique identifier for the booking

        [Required]
        public Guid UserId { get; set; } // The user who made the booking

        [Required]
        public string Description { get; set; } // Details about the booking

        [Required]
        public DateTime StartTime { get; set; } // When the booking starts

        [Required]
        public DateTime EndTime { get; set; } // When the booking ends

        [Required]
        public string Location { get; set; } // Where the booking takes place

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Timestamp of when the booking was created
    }
}
