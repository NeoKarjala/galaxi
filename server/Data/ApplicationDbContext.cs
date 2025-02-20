using Microsoft.EntityFrameworkCore;
using GaLaXiBackend.Models;

namespace GaLaXiBackend.Data
{
    /// <summary>
    /// Database context that manages application data and interactions with PostgreSQL.
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        /// <summary>
        /// Constructor that initializes the database context with options.
        /// </summary>
        /// <param name="options">Database context options</param>
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        /// <summary>
        /// Users table in the database.
        /// </summary>
        public DbSet<User> Users { get; set; }

        /// <summary>
        /// Bookings table in the database.
        /// </summary>
        public DbSet<Booking> Bookings { get; set; }

        /// <summary>
        /// Configures relationships between database tables when the model is created.
        /// </summary>
        /// <param name="modelBuilder">Model builder for defining entity relationships</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define foreign key relationship: Booking.UserId → Users.Id
            modelBuilder.Entity<Booking>()
                .HasOne<User>()  // A booking belongs to a user
                .WithMany()  // A user can have multiple bookings
                .HasForeignKey(b => b.UserId)  // Foreign key in Bookings table
                .OnDelete(DeleteBehavior.Cascade);  // If a user is deleted, delete their bookings too
        }
    }
}
