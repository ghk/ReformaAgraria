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
                name: "asp_net_roles",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    concurrency_stamp = table.Column<string>(type: "text", nullable: true),
                    name = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    normalized_name = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_users",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    access_failed_count = table.Column<int>(type: "int4", nullable: false),
                    concurrency_stamp = table.Column<string>(type: "text", nullable: true),
                    email = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    email_confirmed = table.Column<bool>(type: "bool", nullable: false),
                    lockout_enabled = table.Column<bool>(type: "bool", nullable: false),
                    lockout_end = table.Column<DateTimeOffset>(type: "timestamptz", nullable: true),
                    normalized_email = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    normalized_user_name = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    password_hash = table.Column<string>(type: "text", nullable: true),
                    phone_number = table.Column<string>(type: "text", nullable: true),
                    phone_number_confirmed = table.Column<bool>(type: "bool", nullable: false),
                    security_stamp = table.Column<string>(type: "text", nullable: true),
                    two_factor_enabled = table.Column<bool>(type: "bool", nullable: false),
                    user_name = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "coordinate",
                columns: table => new
                {
                    id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    date_created = table.Column<DateTime>(type: "timestamp", nullable: true),
                    date_modified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    latitude = table.Column<decimal>(type: "numeric", nullable: false),
                    longitude = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_coordinate", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "event",
                columns: table => new
                {
                    id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    agenda = table.Column<string>(type: "text", nullable: true),
                    date_created = table.Column<DateTime>(type: "timestamp", nullable: true),
                    date_modified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    end_date = table.Column<DateTime>(type: "timestamp", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: true),
                    place = table.Column<string>(type: "text", nullable: true),
                    region_type = table.Column<int>(type: "int4", nullable: false),
                    start_date = table.Column<DateTime>(type: "timestamp", nullable: false),
                    title = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_event", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "policies_documents",
                columns: table => new
                {
                    id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    attachment = table.Column<string>(type: "text", nullable: true),
                    date_created = table.Column<DateTime>(type: "timestamp", nullable: true),
                    date_modified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    title = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_policies_documents", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "region",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    date_created = table.Column<DateTime>(type: "timestamp", nullable: true),
                    date_modified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    fk_parent_id = table.Column<string>(type: "text", nullable: true),
                    is_kelurahan = table.Column<bool>(type: "bool", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    type = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_region", x => x.id);
                    table.ForeignKey(
                        name: "fk_region_region_fk_parent_id",
                        column: x => x.fk_parent_id,
                        principalTable: "region",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "tora_submission",
                columns: table => new
                {
                    id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    attachment = table.Column<string>(type: "text", nullable: true),
                    date_created = table.Column<DateTime>(type: "timestamp", nullable: true),
                    date_modified = table.Column<DateTime>(type: "timestamp", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tora_submission", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_role_claims",
                columns: table => new
                {
                    id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    claim_type = table.Column<string>(type: "text", nullable: true),
                    claim_value = table.Column<string>(type: "text", nullable: true),
                    role_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_role_claims", x => x.id);
                    table.ForeignKey(
                        name: "fk_asp_net_role_claims_asp_net_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "asp_net_roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_user_claims",
                columns: table => new
                {
                    id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    claim_type = table.Column<string>(type: "text", nullable: true),
                    claim_value = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_claims", x => x.id);
                    table.ForeignKey(
                        name: "fk_asp_net_user_claims_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_user_logins",
                columns: table => new
                {
                    login_provider = table.Column<string>(type: "text", nullable: false),
                    provider_key = table.Column<string>(type: "text", nullable: false),
                    provider_display_name = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_logins", x => new { x.login_provider, x.provider_key });
                    table.ForeignKey(
                        name: "fk_asp_net_user_logins_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_user_roles",
                columns: table => new
                {
                    user_id = table.Column<string>(type: "text", nullable: false),
                    role_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_roles", x => new { x.user_id, x.role_id });
                    table.ForeignKey(
                        name: "fk_asp_net_user_roles_asp_net_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "asp_net_roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_asp_net_user_roles_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "asp_net_user_tokens",
                columns: table => new
                {
                    user_id = table.Column<string>(type: "text", nullable: false),
                    login_provider = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_tokens", x => new { x.user_id, x.login_provider, x.name });
                    table.ForeignKey(
                        name: "fk_asp_net_user_tokens_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "asp_net_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "meeting_report",
                columns: table => new
                {
                    id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    attachment = table.Column<string>(type: "text", nullable: true),
                    date_created = table.Column<DateTime>(type: "timestamp", nullable: true),
                    date_modified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    fk_event_id = table.Column<int>(type: "int4", nullable: false)
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
                name: "profile_of_village",
                columns: table => new
                {
                    id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    date_created = table.Column<DateTime>(type: "timestamp", nullable: true),
                    date_modified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    fk_region_id = table.Column<string>(type: "text", nullable: true),
                    history = table.Column<string>(type: "text", nullable: true),
                    potential = table.Column<string>(type: "text", nullable: true),
                    tenurial_condition = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_profile_of_village", x => x.id);
                    table.ForeignKey(
                        name: "fk_profile_of_village_region_fk_region_id",
                        column: x => x.fk_region_id,
                        principalTable: "region",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "proposal_of_act_document_check_list",
                columns: table => new
                {
                    id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    date_created = table.Column<DateTime>(type: "timestamp", nullable: true),
                    date_modified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    fk_region_id = table.Column<string>(type: "text", nullable: true),
                    proposal_from_community_list = table.Column<bool>(type: "bool", nullable: false),
                    ps_object_and_customary_forest_list = table.Column<bool>(type: "bool", nullable: false),
                    ps_object_and_customary_forest_map = table.Column<bool>(type: "bool", nullable: false),
                    ps_subject_and_customary_forest_list = table.Column<bool>(type: "bool", nullable: false),
                    tora_object_forest_area_list = table.Column<bool>(type: "bool", nullable: false),
                    tora_object_forest_area_map = table.Column<bool>(type: "bool", nullable: false),
                    tora_object_list = table.Column<bool>(type: "bool", nullable: false),
                    tora_object_map = table.Column<bool>(type: "bool", nullable: false),
                    tora_subject_forest_area_list = table.Column<bool>(type: "bool", nullable: false),
                    tora_subject_list = table.Column<bool>(type: "bool", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_proposal_of_act_document_check_list", x => x.id);
                    table.ForeignKey(
                        name: "fk_proposal_of_act_document_check_list_region_fk_region_id",
                        column: x => x.fk_region_id,
                        principalTable: "region",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "tipology_of_agrarian_problem",
                columns: table => new
                {
                    id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    codefication = table.Column<int>(type: "int4", nullable: false),
                    communal_subject_data_check_list = table.Column<bool>(type: "bool", nullable: false),
                    contact_person = table.Column<string>(type: "text", nullable: true),
                    date_created = table.Column<DateTime>(type: "timestamp", nullable: true),
                    date_modified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    farm_size = table.Column<decimal>(type: "numeric", nullable: false),
                    field_size = table.Column<decimal>(type: "numeric", nullable: false),
                    fk_coordinate_id = table.Column<int>(type: "int4", nullable: true),
                    fk_region_id = table.Column<string>(type: "text", nullable: true),
                    forest_size = table.Column<decimal>(type: "numeric", nullable: false),
                    garden_size = table.Column<decimal>(type: "numeric", nullable: false),
                    habitation_size = table.Column<decimal>(type: "numeric", nullable: false),
                    individual_subject_data_check_list = table.Column<bool>(type: "bool", nullable: false),
                    land_tenure_history_data_check_list = table.Column<bool>(type: "bool", nullable: false),
                    land_type = table.Column<int>(type: "int4", nullable: false),
                    main_problem = table.Column<string>(type: "text", nullable: true),
                    mere_size = table.Column<decimal>(type: "numeric", nullable: false),
                    object_data_check_list = table.Column<bool>(type: "bool", nullable: false),
                    paddy_field_size = table.Column<decimal>(type: "numeric", nullable: false),
                    proposed_size = table.Column<decimal>(type: "numeric", nullable: false),
                    proposed_treatment = table.Column<int>(type: "int4", nullable: false),
                    size = table.Column<decimal>(type: "numeric", nullable: false),
                    total_family = table.Column<int>(type: "int4", nullable: false),
                    total_people = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tipology_of_agrarian_problem", x => x.id);
                    table.ForeignKey(
                        name: "fk_tipology_of_agrarian_problem_coordinate_fk_coordinate_id",
                        column: x => x.fk_coordinate_id,
                        principalTable: "coordinate",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_tipology_of_agrarian_problem_region_fk_region_id",
                        column: x => x.fk_region_id,
                        principalTable: "region",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "tora_map_attribute",
                columns: table => new
                {
                    id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    attachment = table.Column<string>(type: "text", nullable: true),
                    border_setting_status = table.Column<int>(type: "int4", nullable: false),
                    date_created = table.Column<DateTime>(type: "timestamp", nullable: true),
                    date_modified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    fk_coordinate_id = table.Column<int>(type: "int4", nullable: true),
                    fk_region_id = table.Column<string>(type: "text", nullable: true),
                    size = table.Column<decimal>(type: "numeric", nullable: false),
                    tora_setting_process_stage = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tora_map_attribute", x => x.id);
                    table.ForeignKey(
                        name: "fk_tora_map_attribute_coordinate_fk_coordinate_id",
                        column: x => x.fk_coordinate_id,
                        principalTable: "coordinate",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_tora_map_attribute_region_fk_region_id",
                        column: x => x.fk_region_id,
                        principalTable: "region",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "tora_object",
                columns: table => new
                {
                    id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    date_created = table.Column<DateTime>(type: "timestamp", nullable: true),
                    date_modified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    fk_region_id = table.Column<string>(type: "text", nullable: true),
                    land_status = table.Column<int>(type: "int4", nullable: false),
                    land_tenure_history = table.Column<string>(type: "text", nullable: true),
                    land_type = table.Column<int>(type: "int4", nullable: false),
                    livelihood = table.Column<string>(type: "text", nullable: true),
                    proposed_treatment = table.Column<int>(type: "int4", nullable: false),
                    regional_status = table.Column<int>(type: "int4", nullable: false),
                    size = table.Column<decimal>(type: "numeric", nullable: false),
                    total_tenants = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tora_object", x => x.id);
                    table.ForeignKey(
                        name: "fk_tora_object_region_fk_region_id",
                        column: x => x.fk_region_id,
                        principalTable: "region",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "village_map_attribute",
                columns: table => new
                {
                    id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    attachment = table.Column<string>(type: "text", nullable: true),
                    border_setting_process_stage = table.Column<int>(type: "int4", nullable: false),
                    border_setting_status = table.Column<int>(type: "int4", nullable: false),
                    date_created = table.Column<DateTime>(type: "timestamp", nullable: true),
                    date_modified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    fk_coordinate_id = table.Column<int>(type: "int4", nullable: true),
                    fk_region_id = table.Column<string>(type: "text", nullable: true),
                    size = table.Column<decimal>(type: "numeric", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "meeting_attendee",
                columns: table => new
                {
                    id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    date_created = table.Column<DateTime>(type: "timestamp", nullable: true),
                    date_modified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    meeting_minute_id = table.Column<int>(type: "int4", nullable: true),
                    name = table.Column<string>(type: "text", nullable: true)
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

            migrationBuilder.CreateTable(
                name: "tora_subject",
                columns: table => new
                {
                    id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    address = table.Column<string>(type: "text", nullable: true),
                    age = table.Column<int>(type: "int4", nullable: true),
                    date_created = table.Column<DateTime>(type: "timestamp", nullable: true),
                    date_modified = table.Column<DateTime>(type: "timestamp", nullable: true),
                    educational_attainment = table.Column<int>(type: "int4", nullable: false),
                    fk_tora_object_id = table.Column<int>(type: "int4", nullable: false),
                    gender = table.Column<int>(type: "int4", nullable: false),
                    land_location = table.Column<string>(type: "text", nullable: true),
                    land_status = table.Column<string>(type: "text", nullable: true),
                    marital_status = table.Column<int>(type: "int4", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    plant_types = table.Column<string>(type: "text", nullable: true),
                    size = table.Column<decimal>(type: "numeric", nullable: false),
                    total_family_members = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tora_subject", x => x.id);
                    table.ForeignKey(
                        name: "fk_tora_subject_tora_object_fk_tora_object_id",
                        column: x => x.fk_tora_object_id,
                        principalTable: "tora_object",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_role_claims_role_id",
                table: "asp_net_role_claims",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "role_name_index",
                table: "asp_net_roles",
                column: "normalized_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_user_claims_user_id",
                table: "asp_net_user_claims",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_user_logins_user_id",
                table: "asp_net_user_logins",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_user_roles_role_id",
                table: "asp_net_user_roles",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "email_index",
                table: "asp_net_users",
                column: "normalized_email");

            migrationBuilder.CreateIndex(
                name: "user_name_index",
                table: "asp_net_users",
                column: "normalized_user_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_meeting_attendee_meeting_minute_id",
                table: "meeting_attendee",
                column: "meeting_minute_id");

            migrationBuilder.CreateIndex(
                name: "ix_meeting_report_fk_event_id",
                table: "meeting_report",
                column: "fk_event_id");

            migrationBuilder.CreateIndex(
                name: "ix_profile_of_village_fk_region_id",
                table: "profile_of_village",
                column: "fk_region_id");

            migrationBuilder.CreateIndex(
                name: "ix_proposal_of_act_document_check_list_fk_region_id",
                table: "proposal_of_act_document_check_list",
                column: "fk_region_id");

            migrationBuilder.CreateIndex(
                name: "ix_region_fk_parent_id",
                table: "region",
                column: "fk_parent_id");

            migrationBuilder.CreateIndex(
                name: "ix_tipology_of_agrarian_problem_fk_coordinate_id",
                table: "tipology_of_agrarian_problem",
                column: "fk_coordinate_id");

            migrationBuilder.CreateIndex(
                name: "ix_tipology_of_agrarian_problem_fk_region_id",
                table: "tipology_of_agrarian_problem",
                column: "fk_region_id");

            migrationBuilder.CreateIndex(
                name: "ix_tora_map_attribute_fk_coordinate_id",
                table: "tora_map_attribute",
                column: "fk_coordinate_id");

            migrationBuilder.CreateIndex(
                name: "ix_tora_map_attribute_fk_region_id",
                table: "tora_map_attribute",
                column: "fk_region_id");

            migrationBuilder.CreateIndex(
                name: "ix_tora_object_fk_region_id",
                table: "tora_object",
                column: "fk_region_id");

            migrationBuilder.CreateIndex(
                name: "ix_tora_subject_fk_tora_object_id",
                table: "tora_subject",
                column: "fk_tora_object_id");

            migrationBuilder.CreateIndex(
                name: "ix_village_map_attribute_fk_coordinate_id",
                table: "village_map_attribute",
                column: "fk_coordinate_id");

            migrationBuilder.CreateIndex(
                name: "ix_village_map_attribute_fk_region_id",
                table: "village_map_attribute",
                column: "fk_region_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "asp_net_role_claims");

            migrationBuilder.DropTable(
                name: "asp_net_user_claims");

            migrationBuilder.DropTable(
                name: "asp_net_user_logins");

            migrationBuilder.DropTable(
                name: "asp_net_user_roles");

            migrationBuilder.DropTable(
                name: "asp_net_user_tokens");

            migrationBuilder.DropTable(
                name: "meeting_attendee");

            migrationBuilder.DropTable(
                name: "policies_documents");

            migrationBuilder.DropTable(
                name: "profile_of_village");

            migrationBuilder.DropTable(
                name: "proposal_of_act_document_check_list");

            migrationBuilder.DropTable(
                name: "tipology_of_agrarian_problem");

            migrationBuilder.DropTable(
                name: "tora_map_attribute");

            migrationBuilder.DropTable(
                name: "tora_subject");

            migrationBuilder.DropTable(
                name: "tora_submission");

            migrationBuilder.DropTable(
                name: "village_map_attribute");

            migrationBuilder.DropTable(
                name: "asp_net_roles");

            migrationBuilder.DropTable(
                name: "asp_net_users");

            migrationBuilder.DropTable(
                name: "meeting_report");

            migrationBuilder.DropTable(
                name: "tora_object");

            migrationBuilder.DropTable(
                name: "coordinate");

            migrationBuilder.DropTable(
                name: "event");

            migrationBuilder.DropTable(
                name: "region");
        }
    }
}
