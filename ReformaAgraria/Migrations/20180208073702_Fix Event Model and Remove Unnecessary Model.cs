using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace ReformaAgraria.Migrations
{
    public partial class FixEventModelandRemoveUnnecessaryModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "meeting_attendee");

            migrationBuilder.DropTable(
                name: "meeting_report");

            migrationBuilder.DropColumn(
                name: "total_tenants",
                table: "tora_object");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "total_tenants",
                table: "tora_object",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "meeting_report",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    attachment = table.Column<string>(nullable: true),
                    date_created = table.Column<DateTime>(nullable: true),
                    date_modified = table.Column<DateTime>(nullable: true),
                    description = table.Column<string>(nullable: true),
                    fk_event_id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_meeting_report", x => x.id);
                    table.ForeignKey(
                        name: "fk_meeting_report_event_fk_event_id",
                        column: x => x.fk_event_id,
                        principalTable: "event",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "meeting_attendee",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    date_created = table.Column<DateTime>(nullable: true),
                    date_modified = table.Column<DateTime>(nullable: true),
                    meeting_minute_id = table.Column<int>(nullable: true),
                    name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_meeting_attendee", x => x.id);
                    table.ForeignKey(
                        name: "fk_meeting_attendee_meeting_report_meeting_minute_id",
                        column: x => x.meeting_minute_id,
                        principalTable: "meeting_report",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_meeting_attendee_meeting_minute_id",
                table: "meeting_attendee",
                column: "meeting_minute_id");

            migrationBuilder.CreateIndex(
                name: "ix_meeting_report_fk_event_id",
                table: "meeting_report",
                column: "fk_event_id");
        }
    }
}