using Microsoft.EntityFrameworkCore.Migrations;

namespace ReformaAgraria.Migrations
{
    public partial class AddcolumnNametoToraMap : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "tora_map",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "name",
                table: "tora_map");
        }
    }
}