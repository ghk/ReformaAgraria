using Microsoft.EntityFrameworkCore.Migrations;

namespace ReformaAgraria.Migrations
{
    public partial class ChangeToraObjekstagestostatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "stages",
                table: "tora_object");

            migrationBuilder.AddColumn<int>(
                name: "status",
                table: "tora_object",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "status",
                table: "tora_object");

            migrationBuilder.AddColumn<int>(
                name: "stages",
                table: "tora_object",
                nullable: false,
                defaultValue: 0);
        }
    }
}