using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ReformaAgraria.Migrations
{
    public partial class PersildanSkema : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "fk_persil_id",
                table: "tora_subject",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "persil",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    date_created = table.Column<DateTime>(nullable: true),
                    date_modified = table.Column<DateTime>(nullable: true),
                    fk_region_id = table.Column<string>(nullable: true),
                    geojson = table.Column<string>(type: "jsonb", nullable: true),
                    scheme = table.Column<int>(nullable: false),
                    status = table.Column<int>(nullable: false),
                    total_size = table.Column<decimal>(nullable: true),
                    total_subject = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_persil", x => x.id);
                    table.ForeignKey(
                        name: "fk_persil_region_fk_region_id",
                        column: x => x.fk_region_id,
                        principalTable: "region",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_tora_subject_fk_persil_id",
                table: "tora_subject",
                column: "fk_persil_id");

            migrationBuilder.CreateIndex(
                name: "ix_persil_fk_region_id",
                table: "persil",
                column: "fk_region_id");

            migrationBuilder.AddForeignKey(
                name: "fk_tora_subject_persil_fk_persil_id",
                table: "tora_subject",
                column: "fk_persil_id",
                principalTable: "persil",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_tora_subject_persil_fk_persil_id",
                table: "tora_subject");

            migrationBuilder.DropTable(
                name: "persil");

            migrationBuilder.DropIndex(
                name: "ix_tora_subject_fk_persil_id",
                table: "tora_subject");

            migrationBuilder.DropColumn(
                name: "fk_persil_id",
                table: "tora_subject");
        }
    }
}
