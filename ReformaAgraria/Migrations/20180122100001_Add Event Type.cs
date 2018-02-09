using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace ReformaAgraria.Migrations
{
    public partial class AddEventType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "title",
                table: "event",
                newName: "fk_event_type_id");

            migrationBuilder.CreateTable(
                name: "event_type",
                columns: table => new
                {
                    id = table.Column<string>(nullable: false),
                    date_created = table.Column<DateTime>(nullable: true),
                    date_modified = table.Column<DateTime>(nullable: true),
                    name = table.Column<string>(nullable: true),
                    region_type = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_event_type", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_event_fk_event_type_id",
                table: "event",
                column: "fk_event_type_id");

            migrationBuilder.AddForeignKey(
                name: "fk_event_event_type_fk_event_type_id",
                table: "event",
                column: "fk_event_type_id",
                principalTable: "event_type",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_event_event_type_fk_event_type_id",
                table: "event");

            migrationBuilder.DropTable(
                name: "event_type");

            migrationBuilder.DropIndex(
                name: "ix_event_fk_event_type_id",
                table: "event");

            migrationBuilder.RenameColumn(
                name: "fk_event_type_id",
                table: "event",
                newName: "title");
        }
    }
}