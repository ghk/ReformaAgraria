using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace ReformaAgraria.Migrations
{
    public partial class ChangeVIllageMapAttributeToToraMap : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "village_map_attribute");

            migrationBuilder.CreateTable(
                name: "tora_map",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    date_created = table.Column<DateTime>(nullable: true),
                    date_modified = table.Column<DateTime>(nullable: true),
                    fk_region_id = table.Column<string>(nullable: true),
                    geojson = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tora_map", x => x.id);
                    table.ForeignKey(
                        name: "fk_tora_map_region_fk_region_id",
                        column: x => x.fk_region_id,
                        principalTable: "region",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_tora_map_fk_region_id",
                table: "tora_map",
                column: "fk_region_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tora_map");

            migrationBuilder.CreateTable(
                name: "village_map_attribute",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    attachment = table.Column<string>(nullable: true),
                    border_setting_process_stage = table.Column<int>(nullable: false),
                    border_setting_status = table.Column<int>(nullable: false),
                    date_created = table.Column<DateTime>(nullable: true),
                    date_modified = table.Column<DateTime>(nullable: true),
                    fk_coordinate_id = table.Column<int>(nullable: true),
                    fk_region_id = table.Column<string>(nullable: true),
                    size = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_village_map_attribute", x => x.id);
                    table.ForeignKey(
                        name: "fk_village_map_attribute_coordinate_fk_coordinate_id",
                        column: x => x.fk_coordinate_id,
                        principalTable: "coordinate",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_village_map_attribute_region_fk_region_id",
                        column: x => x.fk_region_id,
                        principalTable: "region",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_village_map_attribute_fk_coordinate_id",
                table: "village_map_attribute",
                column: "fk_coordinate_id");

            migrationBuilder.CreateIndex(
                name: "ix_village_map_attribute_fk_region_id",
                table: "village_map_attribute",
                column: "fk_region_id");
        }
    }
}