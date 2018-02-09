using Microsoft.EntityFrameworkCore.Migrations;

namespace ReformaAgraria.Migrations
{
    public partial class FixEventModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "total_subjects",
                table: "tora_object",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "total_subjects",
                table: "tora_object");
        }
    }
}