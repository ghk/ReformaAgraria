using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ReformaAgraria.Migrations
{
    public partial class ChangeEventGeojsonColumnTypetoJSONB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE tora_map ALTER COLUMN geojson TYPE JSONB USING geojson::JSONB;");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE tora_map ALTER COLUMN geojson TYPE TEXT USING geojson::TEXT;");
        }
    }
}
