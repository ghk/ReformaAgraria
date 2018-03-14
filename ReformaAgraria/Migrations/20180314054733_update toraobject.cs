using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ReformaAgraria.Migrations
{
    public partial class updatetoraobject : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "fk_scheme_id",
                table: "tora_object",
                nullable: false,
                defaultValueSql: "1",
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "ix_tora_object_fk_scheme_id",
                table: "tora_object",
                column: "fk_scheme_id");

            migrationBuilder.AddForeignKey(
                name: "fk_tora_object_scheme_fk_scheme_id",
                table: "tora_object",
                column: "fk_scheme_id",
                principalTable: "scheme",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_tora_object_scheme_fk_scheme_id",
                table: "tora_object");

            migrationBuilder.DropIndex(
                name: "ix_tora_object_fk_scheme_id",
                table: "tora_object");

            migrationBuilder.DropColumn(
                name: "fk_scheme_id",
                table: "tora_object");
        }
    }
}
