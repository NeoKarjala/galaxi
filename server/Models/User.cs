using System;
using System.ComponentModel.DataAnnotations;

namespace GaLaXiBackend.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid(); // Unique identifier for the user

        [Required, EmailAddress]
        public string Email { get; set; } // User's email address

        [Required]
        public string Username { get; set; } // Display name of the user

        [Required]
        public string Role { get; set; } = "user"; // User role (default is "user")

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Timestamp of account creation
    }
}
