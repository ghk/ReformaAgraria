using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ReformaAgraria.Migrations
{
    public partial class addfktoraobjectidintoramaptable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "fk_tora_object_id",
                table: "tora_map",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "ix_tora_map_fk_tora_object_id",
                table: "tora_map",
                column: "fk_tora_object_id");

            migrationBuilder.AddForeignKey(
                name: "fk_tora_map_tora_object_fk_tora_object_id",
                table: "tora_map",
                column: "fk_tora_object_id",
                principalTable: "tora_object",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_tora_map_tora_object_fk_tora_object_id",
                table: "tora_map");

            migrationBuilder.DropIndex(
                name: "ix_tora_map_fk_tora_object_id",
                table: "tora_map");

            migrationBuilder.DropColumn(
                name: "fk_tora_object_id",
                table: "tora_map");
        }
    }
}
