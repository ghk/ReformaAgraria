using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ReformaAgraria.Migrations
{
    public partial class ChangeEventModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "agenda",
                table: "event");

            migrationBuilder.DropColumn(
                name: "region_type",
                table: "event");

            migrationBuilder.RenameColumn(
                name: "place",
                table: "event",
                newName: "fk_region_id");

            migrationBuilder.RenameColumn(
                name: "notes",
                table: "event",
                newName: "description");

            migrationBuilder.CreateIndex(
                name: "ix_event_fk_region_id",
                table: "event",
                column: "fk_region_id");

            migrationBuilder.AddForeignKey(
                name: "fk_event_region_fk_region_id",
                table: "event",
                column: "fk_region_id",
                principalTable: "region",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_event_region_fk_region_id",
                table: "event");

            migrationBuilder.DropIndex(
                name: "ix_event_fk_region_id",
                table: "event");

            migrationBuilder.RenameColumn(
                name: "fk_region_id",
                table: "event",
                newName: "place");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "event",
                newName: "notes");

            migrationBuilder.AddColumn<string>(
                name: "agenda",
                table: "event",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "region_type",
                table: "event",
                nullable: false,
                defaultValue: 0);
        }
    }
}
