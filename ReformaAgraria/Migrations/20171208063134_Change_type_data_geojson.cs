using Microsoft.EntityFrameworkCore.Migrations;

namespace ReformaAgraria.Migrations
{
    public partial class Change_type_data_geojson : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "geo_json",
                table: "base_layers",
                newName: "geojson");

            migrationBuilder.AlterColumn<string>(
                name: "geojson",
                table: "base_layers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 4010,
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "geojson",
                table: "base_layers",
                newName: "geo_json");

            migrationBuilder.AlterColumn<string>(
                name: "geo_json",
                table: "base_layers",
                maxLength: 4010,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}