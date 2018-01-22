using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ReformaAgraria.Migrations
{
    public partial class ChangeLibraryModeltoAddFileExtension : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "path",
                table: "library",
                newName: "file_extension");

            migrationBuilder.AlterColumn<DateTime>(
                name: "end_date",
                table: "event",
                nullable: true,
                oldClrType: typeof(DateTime));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "file_extension",
                table: "library",
                newName: "path");

            migrationBuilder.AlterColumn<DateTime>(
                name: "end_date",
                table: "event",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldNullable: true);
        }
    }
}
