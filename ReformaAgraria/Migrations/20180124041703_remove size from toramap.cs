using Microsoft.EntityFrameworkCore.Migrations;

namespace ReformaAgraria.Migrations
{
    public partial class removesizefromtoramap : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "size",
                table: "tora_map");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "size",
                table: "tora_map",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}