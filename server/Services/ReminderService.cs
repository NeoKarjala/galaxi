using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using GaLaXiBackend.Data;
using GaLaXiBackend.Services;

namespace GaLaXiBackend.BackgroundServices
{
    /// <summary>
    /// Background service for sending email reminders about upcoming bookings.
    /// Runs periodically to check for bookings and notify users in advance.
    /// </summary>
    public class ReminderService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IConfiguration _configuration;
        private int _reminderTimeMinutes;

        public ReminderService(IServiceScopeFactory scopeFactory, IConfiguration configuration)
        {
            _scopeFactory = scopeFactory;
            _configuration = configuration;
            _reminderTimeMinutes = int.Parse(_configuration["EmailSettings:ReminderTimeMinutes"] ?? "1440");
        }

        /// <summary>
        /// Executes the background service periodically.
        /// </summary>
        /// <param name="stoppingToken">Token to stop execution</param>
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await SendBookingReminders();
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken); // Runs every 1 hour
            }
        }

        /// <summary>
        /// Checks for upcoming bookings and sends reminder emails.
        /// </summary>
        private async Task SendBookingReminders()
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var emailService = scope.ServiceProvider.GetRequiredService<EmailService>(); // ✅ Get EmailService inside method

            var reminderTime = DateTime.UtcNow.AddMinutes(_reminderTimeMinutes); // 1 day before booking

            var upcomingBookings = dbContext.Bookings
                .Where(b => b.StartTime >= reminderTime && b.StartTime <= reminderTime.AddMinutes(60))
                .ToList();

            foreach (var booking in upcomingBookings)
            {
                var user = dbContext.Users.FirstOrDefault(u => u.Id == booking.UserId);
                if (user != null)
                {
                    string subject = "Upcoming Booking Reminder - GaLaXi";
                    string body = $"Hello {user.Username},<br><br>"
                                + $"This is a reminder for your upcoming booking happening **tomorrow**.<br>"
                                + $"📍 Booking Details:<br>"
                                + $"🖥 Computer: {(booking.ComputerId.HasValue ? booking.ComputerId : "N/A")}<br>"
                                + $"📅 Date: {booking.StartTime} - {booking.EndTime}<br>"
                                + $"🎮 Room Booking: {(booking.IsRoomBooking ? booking.RoomBookingType : "N/A")}<br><br>"
                                + $"We hope you enjoy your session!<br>GaLaXi Team";

                    await Task.Run(() => emailService.SendEmail(user.Email, subject, body)); // ✅ Use EmailService inside scope
                }
            }
        }
    }
}
