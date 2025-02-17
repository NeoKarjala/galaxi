using System;
using System.ComponentModel.DataAnnotations;

namespace GaLaXiBackend.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Role { get; set; } = "user";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
