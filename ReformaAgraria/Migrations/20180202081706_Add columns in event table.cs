using Microsoft.EntityFrameworkCore.Migrations;

namespace ReformaAgraria.Migrations
{
    public partial class Addcolumnsineventtable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "attendees",
                table: "event",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "result_description",
                table: "event",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "attendees",
                table: "event");

            migrationBuilder.DropColumn(
                name: "result_description",
                table: "event");
        }
    }
}