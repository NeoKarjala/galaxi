using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaLaXiBackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBookingForRoomAndComputers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Location",
                table: "Bookings",
                newName: "RoomBookingType");

            migrationBuilder.AlterColumn<int>(
                name: "ComputerId",
                table: "Bookings",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<bool>(
                name: "IsRoomBooking",
                table: "Bookings",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRoomBooking",
                table: "Bookings");

            migrationBuilder.RenameColumn(
                name: "RoomBookingType",
                table: "Bookings",
                newName: "Location");

            migrationBuilder.AlterColumn<int>(
                name: "ComputerId",
                table: "Bookings",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }
    }
}
