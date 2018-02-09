using Microsoft.EntityFrameworkCore.Migrations;

namespace ReformaAgraria.Migrations
{
    public partial class ThirdUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "land_status",
                table: "tora_subject",
                type: "int4",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "full_name",
                table: "asp_net_users",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "full_name",
                table: "asp_net_users");

            migrationBuilder.AlterColumn<string>(
                name: "land_status",
                table: "tora_subject",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int4");
        }
    }
}