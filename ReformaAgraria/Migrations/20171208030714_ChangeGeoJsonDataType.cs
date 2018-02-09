using Microsoft.EntityFrameworkCore.Migrations;

namespace ReformaAgraria.Migrations
{
    public partial class ChangeGeoJsonDataType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "geo_json",
                table: "base_layers",
                type: "varchar(4010)",
                maxLength: 4010,
                nullable: true,
                oldClrType: typeof(long));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "geo_json",
                table: "base_layers",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(4010)",
                oldMaxLength: 4010,
                oldNullable: true);
        }
    }
}