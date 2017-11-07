using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ReformaAgraria.Migrations
{
    public partial class SecondUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "marital_status",
                table: "tora_subject",
                type: "int4",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "educational_attainment",
                table: "tora_subject",
                type: "int4",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "age",
                table: "tora_subject",
                type: "int4",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "regional_status",
                table: "tora_object",
                type: "int4",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "land_status",
                table: "tora_object",
                type: "int4",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "conflict_chronology",
                table: "tora_object",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "formal_advocacy_progress",
                table: "tora_object",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "non_formal_advocacy_progress",
                table: "tora_object",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "conflict_chronology",
                table: "tora_object");

            migrationBuilder.DropColumn(
                name: "formal_advocacy_progress",
                table: "tora_object");

            migrationBuilder.DropColumn(
                name: "non_formal_advocacy_progress",
                table: "tora_object");

            migrationBuilder.AlterColumn<string>(
                name: "marital_status",
                table: "tora_subject",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int4");

            migrationBuilder.AlterColumn<string>(
                name: "educational_attainment",
                table: "tora_subject",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int4");

            migrationBuilder.AlterColumn<string>(
                name: "age",
                table: "tora_subject",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int4",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "regional_status",
                table: "tora_object",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int4");

            migrationBuilder.AlterColumn<string>(
                name: "land_status",
                table: "tora_object",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int4");
        }
    }
}
