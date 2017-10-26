using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ReformaAgraria.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int4", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bool", nullable: false),
                    LockoutEnabled = table.Column<bool>(type: "bool", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamptz", nullable: true),
                    NormalizedEmail = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bool", nullable: false),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    TwoFactorEnabled = table.Column<bool>(type: "bool", nullable: false),
                    UserName = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Coordinate",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: true),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    Latitude = table.Column<decimal>(type: "numeric", nullable: false),
                    Longitude = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coordinate", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PoliciesDocuments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Attachment = table.Column<string>(type: "text", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: true),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PoliciesDocuments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Region",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: true),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    FkParentId = table.Column<string>(type: "text", nullable: true),
                    IsKelurahan = table.Column<bool>(type: "bool", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Region", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Region_Region_FkParentId",
                        column: x => x.FkParentId,
                        principalTable: "Region",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ToraSubmission",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Attachment = table.Column<string>(type: "text", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: true),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ToraSubmission", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WorkCalendar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Agenda = table.Column<string>(type: "text", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: true),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    EndDate = table.Column<DateTime>(type: "timestamp", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    Place = table.Column<string>(type: "text", nullable: true),
                    RegionType = table.Column<int>(type: "int4", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkCalendar", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true),
                    RoleId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    ProviderKey = table.Column<string>(type: "text", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    RoleId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProfileOfVillage",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: true),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    FkRegionId = table.Column<string>(type: "text", nullable: true),
                    History = table.Column<string>(type: "text", nullable: true),
                    Potential = table.Column<string>(type: "text", nullable: true),
                    TenurialCondition = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileOfVillage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfileOfVillage_Region_FkRegionId",
                        column: x => x.FkRegionId,
                        principalTable: "Region",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProposalOfActDocumentCheckList",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: true),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    FkRegionId = table.Column<string>(type: "text", nullable: true),
                    ProposalFromCommunityList = table.Column<bool>(type: "bool", nullable: false),
                    PsObjectAndCustomaryForestList = table.Column<bool>(type: "bool", nullable: false),
                    PsObjectAndCustomaryForestMap = table.Column<bool>(type: "bool", nullable: false),
                    PsSubjectAndCustomaryForestList = table.Column<bool>(type: "bool", nullable: false),
                    ToraObjectForestAreaList = table.Column<bool>(type: "bool", nullable: false),
                    ToraObjectForestAreaMap = table.Column<bool>(type: "bool", nullable: false),
                    ToraObjectList = table.Column<bool>(type: "bool", nullable: false),
                    ToraObjectMap = table.Column<bool>(type: "bool", nullable: false),
                    ToraSubjectForestAreaList = table.Column<bool>(type: "bool", nullable: false),
                    ToraSubjectList = table.Column<bool>(type: "bool", nullable: false),
                    fkRegionId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProposalOfActDocumentCheckList", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProposalOfActDocumentCheckList_Region_FkRegionId",
                        column: x => x.FkRegionId,
                        principalTable: "Region",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TipologyOfAgrarianProblem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Codefication = table.Column<int>(type: "int4", nullable: false),
                    CommunalSubjectDataCheckList = table.Column<bool>(type: "bool", nullable: false),
                    ContactPerson = table.Column<string>(type: "text", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: true),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    FarmSize = table.Column<decimal>(type: "numeric", nullable: false),
                    FieldSize = table.Column<decimal>(type: "numeric", nullable: false),
                    FkCoordinateId = table.Column<int>(type: "int4", nullable: true),
                    FkRegionId = table.Column<string>(type: "text", nullable: true),
                    ForestSize = table.Column<decimal>(type: "numeric", nullable: false),
                    GardenSize = table.Column<decimal>(type: "numeric", nullable: false),
                    HabitationSize = table.Column<decimal>(type: "numeric", nullable: false),
                    IndividualSubjectDataCheckList = table.Column<bool>(type: "bool", nullable: false),
                    LandTenureHistoryDataCheckList = table.Column<bool>(type: "bool", nullable: false),
                    LandType = table.Column<int>(type: "int4", nullable: false),
                    MainProblem = table.Column<string>(type: "text", nullable: true),
                    MereSize = table.Column<decimal>(type: "numeric", nullable: false),
                    ObjectDataCheckList = table.Column<bool>(type: "bool", nullable: false),
                    PaddyFieldSize = table.Column<decimal>(type: "numeric", nullable: false),
                    ProposedSize = table.Column<decimal>(type: "numeric", nullable: false),
                    ProposedTreatment = table.Column<int>(type: "int4", nullable: false),
                    Size = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalFamily = table.Column<int>(type: "int4", nullable: false),
                    TotalPeople = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipologyOfAgrarianProblem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TipologyOfAgrarianProblem_Coordinate_FkCoordinateId",
                        column: x => x.FkCoordinateId,
                        principalTable: "Coordinate",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TipologyOfAgrarianProblem_Region_FkRegionId",
                        column: x => x.FkRegionId,
                        principalTable: "Region",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ToraMapAttribute",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Attachment = table.Column<string>(type: "text", nullable: true),
                    BorderSettingStatus = table.Column<int>(type: "int4", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: true),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    FkCoordinateId = table.Column<int>(type: "int4", nullable: true),
                    FkRegionId = table.Column<string>(type: "text", nullable: true),
                    Size = table.Column<decimal>(type: "numeric", nullable: false),
                    ToraSettingProcessStage = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ToraMapAttribute", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ToraMapAttribute_Coordinate_FkCoordinateId",
                        column: x => x.FkCoordinateId,
                        principalTable: "Coordinate",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ToraMapAttribute_Region_FkRegionId",
                        column: x => x.FkRegionId,
                        principalTable: "Region",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ToraObject",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: true),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    FkRegionId = table.Column<string>(type: "text", nullable: true),
                    LandStatus = table.Column<int>(type: "int4", nullable: false),
                    LandTenureHistory = table.Column<string>(type: "text", nullable: true),
                    LandType = table.Column<int>(type: "int4", nullable: false),
                    Livelihood = table.Column<string>(type: "text", nullable: true),
                    ProposedTreatment = table.Column<int>(type: "int4", nullable: false),
                    RegionalStatus = table.Column<int>(type: "int4", nullable: false),
                    Size = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalTenants = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ToraObject", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ToraObject_Region_FkRegionId",
                        column: x => x.FkRegionId,
                        principalTable: "Region",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VillageMapAttribute",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Attachment = table.Column<string>(type: "text", nullable: true),
                    BorderSettingProcessStage = table.Column<int>(type: "int4", nullable: false),
                    BorderSettingStatus = table.Column<int>(type: "int4", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: true),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    FkCoordinateId = table.Column<int>(type: "int4", nullable: true),
                    FkRegionId = table.Column<string>(type: "text", nullable: true),
                    Size = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VillageMapAttribute", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VillageMapAttribute_Coordinate_FkCoordinateId",
                        column: x => x.FkCoordinateId,
                        principalTable: "Coordinate",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VillageMapAttribute_Region_FkRegionId",
                        column: x => x.FkRegionId,
                        principalTable: "Region",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MeetingReport",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Attachment = table.Column<string>(type: "text", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: true),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    FkEventId = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingReport", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeetingReport_WorkCalendar_FkEventId",
                        column: x => x.FkEventId,
                        principalTable: "WorkCalendar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ToraSubject",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Address = table.Column<string>(type: "text", nullable: true),
                    Age = table.Column<int>(type: "int4", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: true),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    EducationalAttainment = table.Column<int>(type: "int4", nullable: false),
                    FkToraObjectId = table.Column<int>(type: "int4", nullable: false),
                    Gender = table.Column<int>(type: "int4", nullable: false),
                    LandLocation = table.Column<string>(type: "text", nullable: true),
                    LandStatus = table.Column<string>(type: "text", nullable: true),
                    MaritalStatus = table.Column<int>(type: "int4", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    PlantTypes = table.Column<string>(type: "text", nullable: true),
                    Size = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalFamilyMembers = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ToraSubject", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ToraSubject_ToraObject_FkToraObjectId",
                        column: x => x.FkToraObjectId,
                        principalTable: "ToraObject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeetingAttendee",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: true),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    MeetingMinuteId = table.Column<int>(type: "int4", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingAttendee", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeetingAttendee_MeetingReport_MeetingMinuteId",
                        column: x => x.MeetingMinuteId,
                        principalTable: "MeetingReport",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendee_MeetingMinuteId",
                table: "MeetingAttendee",
                column: "MeetingMinuteId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingReport_FkEventId",
                table: "MeetingReport",
                column: "FkEventId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfileOfVillage_FkRegionId",
                table: "ProfileOfVillage",
                column: "FkRegionId");

            migrationBuilder.CreateIndex(
                name: "IX_ProposalOfActDocumentCheckList_FkRegionId",
                table: "ProposalOfActDocumentCheckList",
                column: "FkRegionId");

            migrationBuilder.CreateIndex(
                name: "IX_Region_FkParentId",
                table: "Region",
                column: "FkParentId");

            migrationBuilder.CreateIndex(
                name: "IX_TipologyOfAgrarianProblem_FkCoordinateId",
                table: "TipologyOfAgrarianProblem",
                column: "FkCoordinateId");

            migrationBuilder.CreateIndex(
                name: "IX_TipologyOfAgrarianProblem_FkRegionId",
                table: "TipologyOfAgrarianProblem",
                column: "FkRegionId");

            migrationBuilder.CreateIndex(
                name: "IX_ToraMapAttribute_FkCoordinateId",
                table: "ToraMapAttribute",
                column: "FkCoordinateId");

            migrationBuilder.CreateIndex(
                name: "IX_ToraMapAttribute_FkRegionId",
                table: "ToraMapAttribute",
                column: "FkRegionId");

            migrationBuilder.CreateIndex(
                name: "IX_ToraObject_FkRegionId",
                table: "ToraObject",
                column: "FkRegionId");

            migrationBuilder.CreateIndex(
                name: "IX_ToraSubject_FkToraObjectId",
                table: "ToraSubject",
                column: "FkToraObjectId");

            migrationBuilder.CreateIndex(
                name: "IX_VillageMapAttribute_FkCoordinateId",
                table: "VillageMapAttribute",
                column: "FkCoordinateId");

            migrationBuilder.CreateIndex(
                name: "IX_VillageMapAttribute_FkRegionId",
                table: "VillageMapAttribute",
                column: "FkRegionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "MeetingAttendee");

            migrationBuilder.DropTable(
                name: "PoliciesDocuments");

            migrationBuilder.DropTable(
                name: "ProfileOfVillage");

            migrationBuilder.DropTable(
                name: "ProposalOfActDocumentCheckList");

            migrationBuilder.DropTable(
                name: "TipologyOfAgrarianProblem");

            migrationBuilder.DropTable(
                name: "ToraMapAttribute");

            migrationBuilder.DropTable(
                name: "ToraSubject");

            migrationBuilder.DropTable(
                name: "ToraSubmission");

            migrationBuilder.DropTable(
                name: "VillageMapAttribute");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "MeetingReport");

            migrationBuilder.DropTable(
                name: "ToraObject");

            migrationBuilder.DropTable(
                name: "Coordinate");

            migrationBuilder.DropTable(
                name: "WorkCalendar");

            migrationBuilder.DropTable(
                name: "Region");
        }
    }
}
