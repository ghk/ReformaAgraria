using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ReformaAgraria.Migrations
{
    public partial class Initial : Migration
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
                name: "MeetingReport",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    AgendaOfDiscussion = table.Column<string>(type: "text", nullable: true),
                    Attachment = table.Column<string>(type: "text", nullable: true),
                    Date = table.Column<DateTime>(type: "timestamp", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: false),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: false),
                    DescriptionOfResult = table.Column<string>(type: "text", nullable: true),
                    LevelOfMeeting = table.Column<int>(type: "int4", nullable: false),
                    ListOfParticipants = table.Column<string>(type: "text", nullable: true),
                    NameOfActivity = table.Column<string>(type: "text", nullable: true),
                    Place = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingReport", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PoliciesDocuments",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Attachment = table.Column<string>(type: "text", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: false),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: false),
                    TitleOfDocument = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PoliciesDocuments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Region",
                columns: table => new
                {
                    RegionId = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: false),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "int4", nullable: false),
                    fkParentId = table.Column<int>(type: "int4", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Region", x => x.RegionId);
                    table.ForeignKey(
                        name: "FK_Region_Region_fkParentId",
                        column: x => x.fkParentId,
                        principalTable: "Region",
                        principalColumn: "RegionId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ToraSubmission",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Attachment = table.Column<string>(type: "text", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: false),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ToraSubmission", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WorkCalendar",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    AgendaOfActivity = table.Column<string>(type: "text", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: false),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp", nullable: false),
                    ImplementationOfActivity = table.Column<int>(type: "int4", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    Place = table.Column<string>(type: "text", nullable: true),
                    StartDate = table.Column<DateTime>(type: "timestamp", nullable: false),
                    TitleOfActivity = table.Column<string>(type: "text", nullable: true)
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
                name: "ObjectSubjectTora",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Administrative = table.Column<int>(type: "int4", nullable: false),
                    Concession = table.Column<string>(type: "text", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: false),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: false),
                    Field = table.Column<int>(type: "int4", nullable: false),
                    ListOfTenants = table.Column<string>(type: "text", nullable: true),
                    Livelihood = table.Column<string>(type: "text", nullable: true),
                    NIK = table.Column<string>(type: "text", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    ResumeOfCase = table.Column<string>(type: "text", nullable: true),
                    Size = table.Column<double>(type: "float8", nullable: false),
                    SizeOfAPL = table.Column<double>(type: "float8", nullable: false),
                    SizeOfHL = table.Column<double>(type: "float8", nullable: false),
                    SizeOfHP = table.Column<double>(type: "float8", nullable: false),
                    SizeOfHPK = table.Column<double>(type: "float8", nullable: false),
                    SizeOfHPT = table.Column<double>(type: "float8", nullable: false),
                    Status = table.Column<int>(type: "int4", nullable: false),
                    Subject = table.Column<string>(type: "text", nullable: true),
                    fkRegionId = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ObjectSubjectTora", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ObjectSubjectTora_Region_fkRegionId",
                        column: x => x.fkRegionId,
                        principalTable: "Region",
                        principalColumn: "RegionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProfileOfVillage",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: false),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: false),
                    History = table.Column<string>(type: "text", nullable: true),
                    Potential = table.Column<string>(type: "text", nullable: true),
                    TenurialCondition = table.Column<string>(type: "text", nullable: true),
                    fkRegionId = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileOfVillage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfileOfVillage_Region_fkRegionId",
                        column: x => x.fkRegionId,
                        principalTable: "Region",
                        principalColumn: "RegionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProposalOfActDocumentCheckList",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    ListOfPsObjectAndCustomaryForest = table.Column<bool>(type: "bool", nullable: false),
                    ListOfPsSubjectAndCustomaryForest = table.Column<bool>(type: "bool", nullable: false),
                    ListOfToraObjectForestArea = table.Column<bool>(type: "bool", nullable: false),
                    ListOfToraSubject = table.Column<bool>(type: "bool", nullable: false),
                    ListOfToraSubjectForestArea = table.Column<bool>(type: "bool", nullable: false),
                    ListProposalFromCommunity = table.Column<bool>(type: "bool", nullable: false),
                    ListToraObject = table.Column<bool>(type: "bool", nullable: false),
                    MapOfPsObjectAndCustomaryForest = table.Column<bool>(type: "bool", nullable: false),
                    MapOfToraObject = table.Column<bool>(type: "bool", nullable: false),
                    MapOfToraObjectForestArea = table.Column<bool>(type: "bool", nullable: false),
                    fkRegionId = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProposalOfActDocumentCheckList", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProposalOfActDocumentCheckList_Region_fkRegionId",
                        column: x => x.fkRegionId,
                        principalTable: "Region",
                        principalColumn: "RegionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TipologyOfAgrarianProblem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Codefication = table.Column<int>(type: "int4", nullable: false),
                    CommunalSubjectDataCheckList = table.Column<bool>(type: "bool", nullable: false),
                    ContactPerson = table.Column<int>(type: "int4", nullable: false),
                    CoordinateOfLocation = table.Column<string>(type: "text", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "timestamp", nullable: false),
                    DateModified = table.Column<DateTime>(type: "timestamp", nullable: false),
                    HistoryOfLandTenureDataCheckList = table.Column<bool>(type: "bool", nullable: false),
                    IndividualSubjectDataCheckList = table.Column<bool>(type: "bool", nullable: false),
                    MainProblem = table.Column<string>(type: "text", nullable: true),
                    ObjectDataCheckList = table.Column<bool>(type: "bool", nullable: false),
                    ProposedSize = table.Column<double>(type: "float8", nullable: false),
                    ProposedTreatment = table.Column<int>(type: "int4", nullable: false),
                    Size = table.Column<double>(type: "float8", nullable: false),
                    SizeOFField = table.Column<double>(type: "float8", nullable: false),
                    SizeOfFarm = table.Column<double>(type: "float8", nullable: false),
                    SizeOfForest = table.Column<double>(type: "float8", nullable: false),
                    SizeOfGarden = table.Column<double>(type: "float8", nullable: false),
                    SizeOfHabitation = table.Column<double>(type: "float8", nullable: false),
                    SizeOfMere = table.Column<double>(type: "float8", nullable: false),
                    SizeOfPaddyField = table.Column<double>(type: "float8", nullable: false),
                    TotalFamily = table.Column<int>(type: "int4", nullable: false),
                    TotalPeople = table.Column<int>(type: "int4", nullable: false),
                    TypeOfLand = table.Column<int>(type: "int4", nullable: false),
                    fkRegionId = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipologyOfAgrarianProblem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TipologyOfAgrarianProblem_Region_fkRegionId",
                        column: x => x.fkRegionId,
                        principalTable: "Region",
                        principalColumn: "RegionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ToraMapAttribute",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Attachment = table.Column<string>(type: "text", nullable: true),
                    BorderSettingStatus = table.Column<int>(type: "int4", nullable: false),
                    Coordinate = table.Column<string>(type: "text", nullable: true),
                    Size = table.Column<double>(type: "float8", nullable: false),
                    StageOfToraSettingProcess = table.Column<int>(type: "int4", nullable: false),
                    fkRegionId = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ToraMapAttribute", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ToraMapAttribute_Region_fkRegionId",
                        column: x => x.fkRegionId,
                        principalTable: "Region",
                        principalColumn: "RegionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VillageMapAttribute",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Attachment = table.Column<string>(type: "text", nullable: true),
                    BorderSettingStatus = table.Column<int>(type: "int4", nullable: false),
                    Coordinate = table.Column<string>(type: "text", nullable: true),
                    Size = table.Column<double>(type: "float8", nullable: false),
                    StageOfBorderSettingProcess = table.Column<int>(type: "int4", nullable: false),
                    fkRegionId = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VillageMapAttribute", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VillageMapAttribute_Region_fkRegionId",
                        column: x => x.fkRegionId,
                        principalTable: "Region",
                        principalColumn: "RegionId",
                        onDelete: ReferentialAction.Cascade);
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
                name: "IX_ObjectSubjectTora_fkRegionId",
                table: "ObjectSubjectTora",
                column: "fkRegionId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfileOfVillage_fkRegionId",
                table: "ProfileOfVillage",
                column: "fkRegionId");

            migrationBuilder.CreateIndex(
                name: "IX_ProposalOfActDocumentCheckList_fkRegionId",
                table: "ProposalOfActDocumentCheckList",
                column: "fkRegionId");

            migrationBuilder.CreateIndex(
                name: "IX_Region_fkParentId",
                table: "Region",
                column: "fkParentId");

            migrationBuilder.CreateIndex(
                name: "IX_TipologyOfAgrarianProblem_fkRegionId",
                table: "TipologyOfAgrarianProblem",
                column: "fkRegionId");

            migrationBuilder.CreateIndex(
                name: "IX_ToraMapAttribute_fkRegionId",
                table: "ToraMapAttribute",
                column: "fkRegionId");

            migrationBuilder.CreateIndex(
                name: "IX_VillageMapAttribute_fkRegionId",
                table: "VillageMapAttribute",
                column: "fkRegionId");
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
                name: "MeetingReport");

            migrationBuilder.DropTable(
                name: "ObjectSubjectTora");

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
                name: "ToraSubmission");

            migrationBuilder.DropTable(
                name: "VillageMapAttribute");

            migrationBuilder.DropTable(
                name: "WorkCalendar");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Region");
        }
    }
}
