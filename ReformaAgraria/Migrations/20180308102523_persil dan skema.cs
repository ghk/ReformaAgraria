using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ReformaAgraria.Migrations
{
    public partial class persildanskema : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "scheme",
                table: "persil",
                newName: "fk_scheme_id");

            migrationBuilder.CreateTable(
                name: "scheme",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    date_created = table.Column<DateTime>(nullable: true),
                    date_modified = table.Column<DateTime>(nullable: true),
                    details = table.Column<string>(nullable: true),
                    name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_scheme", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_persil_fk_scheme_id",
                table: "persil",
                column: "fk_scheme_id");

            migrationBuilder.AddForeignKey(
                name: "fk_persil_scheme_fk_scheme_id",
                table: "persil",
                column: "fk_scheme_id",
                principalTable: "scheme",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_persil_scheme_fk_scheme_id",
                table: "persil");

            migrationBuilder.DropTable(
                name: "scheme");

            migrationBuilder.DropIndex(
                name: "ix_persil_fk_scheme_id",
                table: "persil");

            migrationBuilder.RenameColumn(
                name: "fk_scheme_id",
                table: "persil",
                newName: "scheme");
        }
    }
}
