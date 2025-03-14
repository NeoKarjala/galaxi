using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaLaXiBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddComputerIdToBookings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ComputerId",
                table: "Bookings",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ComputerId",
                table: "Bookings");
        }
    }
}
