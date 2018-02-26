using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ReformaAgraria.Migrations
{
    public partial class AddVillageBorderMapTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "village_border_map",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    date_created = table.Column<DateTime>(nullable: true),
                    date_modified = table.Column<DateTime>(nullable: true),
                    fk_region_id = table.Column<string>(nullable: true),
                    geojson = table.Column<string>(type: "jsonb", nullable: true),
                    name = table.Column<string>(nullable: true),
                    size = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_village_border_map", x => x.id);
                    table.ForeignKey(
                        name: "fk_village_border_map_region_fk_region_id",
                        column: x => x.fk_region_id,
                        principalTable: "region",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_village_border_map_fk_region_id",
                table: "village_border_map",
                column: "fk_region_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "village_border_map");
        }
    }
}
