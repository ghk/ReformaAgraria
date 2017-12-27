﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using ReformaAgraria.Models;
using System;

namespace ReformaAgraria.Migrations
{
    [DbContext(typeof(ReformaAgrariaDbContext))]
    partial class ReformaAgrariaDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.0.1-rtm-125");

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnName("concurrency_stamp");

                    b.Property<string>("Name")
                        .HasColumnName("name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasColumnName("normalized_name")
                        .HasMaxLength(256);

                    b.HasKey("Id")
                        .HasName("pk_asp_net_roles");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("role_name_index");

                    b.ToTable("asp_net_roles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<string>("ClaimType")
                        .HasColumnName("claim_type");

                    b.Property<string>("ClaimValue")
                        .HasColumnName("claim_value");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnName("role_id");

                    b.HasKey("Id")
                        .HasName("pk_asp_net_role_claims");

                    b.HasIndex("RoleId")
                        .HasName("ix_asp_net_role_claims_role_id");

                    b.ToTable("asp_net_role_claims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<string>("ClaimType")
                        .HasColumnName("claim_type");

                    b.Property<string>("ClaimValue")
                        .HasColumnName("claim_value");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnName("user_id");

                    b.HasKey("Id")
                        .HasName("pk_asp_net_user_claims");

                    b.HasIndex("UserId")
                        .HasName("ix_asp_net_user_claims_user_id");

                    b.ToTable("asp_net_user_claims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnName("login_provider");

                    b.Property<string>("ProviderKey")
                        .HasColumnName("provider_key");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnName("provider_display_name");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnName("user_id");

                    b.HasKey("LoginProvider", "ProviderKey")
                        .HasName("pk_asp_net_user_logins");

                    b.HasIndex("UserId")
                        .HasName("ix_asp_net_user_logins_user_id");

                    b.ToTable("asp_net_user_logins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnName("user_id");

                    b.Property<string>("RoleId")
                        .HasColumnName("role_id");

                    b.HasKey("UserId", "RoleId")
                        .HasName("pk_asp_net_user_roles");

                    b.HasIndex("RoleId")
                        .HasName("ix_asp_net_user_roles_role_id");

                    b.ToTable("asp_net_user_roles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnName("user_id");

                    b.Property<string>("LoginProvider")
                        .HasColumnName("login_provider");

                    b.Property<string>("Name")
                        .HasColumnName("name");

                    b.Property<string>("Value")
                        .HasColumnName("value");

                    b.HasKey("UserId", "LoginProvider", "Name")
                        .HasName("pk_asp_net_user_tokens");

                    b.ToTable("asp_net_user_tokens");
                });

            modelBuilder.Entity("ReformaAgraria.Models.ActProposalDocumentCheckList", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnName("date_created");

                    b.Property<DateTime?>("DateModified")
                        .HasColumnName("date_modified");

                    b.Property<string>("FkRegionId")
                        .HasColumnName("fk_region_id");

                    b.Property<bool>("ProposalFromCommunityList")
                        .HasColumnName("proposal_from_community_list");

                    b.Property<bool>("PsObjectAndCustomaryForestList")
                        .HasColumnName("ps_object_and_customary_forest_list");

                    b.Property<bool>("PsObjectAndCustomaryForestMap")
                        .HasColumnName("ps_object_and_customary_forest_map");

                    b.Property<bool>("PsSubjectAndCustomaryForestList")
                        .HasColumnName("ps_subject_and_customary_forest_list");

                    b.Property<bool>("ToraObjectForestAreaList")
                        .HasColumnName("tora_object_forest_area_list");

                    b.Property<bool>("ToraObjectForestAreaMap")
                        .HasColumnName("tora_object_forest_area_map");

                    b.Property<bool>("ToraObjectList")
                        .HasColumnName("tora_object_list");

                    b.Property<bool>("ToraObjectMap")
                        .HasColumnName("tora_object_map");

                    b.Property<bool>("ToraSubjectForestAreaList")
                        .HasColumnName("tora_subject_forest_area_list");

                    b.Property<bool>("ToraSubjectList")
                        .HasColumnName("tora_subject_list");

                    b.Property<string>("fkRegionId")
                        .HasColumnName("fk_region_id");

                    b.HasKey("Id")
                        .HasName("pk_act_proposal_document_check_list");

                    b.HasIndex("FkRegionId")
                        .HasName("ix_act_proposal_document_check_list_fk_region_id");

                    b.ToTable("act_proposal_document_check_list");
                });

            modelBuilder.Entity("ReformaAgraria.Models.BaseLayer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<string>("Color")
                        .HasColumnName("color");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnName("date_created");

                    b.Property<DateTime?>("DateModified")
                        .HasColumnName("date_modified");

                    b.Property<string>("Geojson")
                        .HasColumnName("geojson");

                    b.Property<string>("Label")
                        .HasColumnName("label");

                    b.HasKey("Id")
                        .HasName("pk_base_layer");

                    b.ToTable("base_layer");
                });

            modelBuilder.Entity("ReformaAgraria.Models.Coordinate", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnName("date_created");

                    b.Property<DateTime?>("DateModified")
                        .HasColumnName("date_modified");

                    b.Property<decimal>("Latitude")
                        .HasColumnName("latitude");

                    b.Property<decimal>("Longitude")
                        .HasColumnName("longitude");

                    b.HasKey("Id")
                        .HasName("pk_coordinate");

                    b.ToTable("coordinate");
                });

            modelBuilder.Entity("ReformaAgraria.Models.Event", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<string>("Agenda")
                        .HasColumnName("agenda");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnName("date_created");

                    b.Property<DateTime?>("DateModified")
                        .HasColumnName("date_modified");

                    b.Property<DateTime>("EndDate")
                        .HasColumnName("end_date");

                    b.Property<string>("Notes")
                        .HasColumnName("notes");

                    b.Property<string>("Place")
                        .HasColumnName("place");

                    b.Property<int>("RegionType")
                        .HasColumnName("region_type");

                    b.Property<DateTime>("StartDate")
                        .HasColumnName("start_date");

                    b.Property<string>("Title")
                        .HasColumnName("title");

                    b.HasKey("Id")
                        .HasName("pk_event");

                    b.ToTable("event");
                });

            modelBuilder.Entity("ReformaAgraria.Models.MeetingAttendee", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnName("date_created");

                    b.Property<DateTime?>("DateModified")
                        .HasColumnName("date_modified");

                    b.Property<int?>("MeetingMinuteId")
                        .HasColumnName("meeting_minute_id");

                    b.Property<string>("Name")
                        .HasColumnName("name");

                    b.HasKey("Id")
                        .HasName("pk_meeting_attendee");

                    b.HasIndex("MeetingMinuteId")
                        .HasName("ix_meeting_attendee_meeting_minute_id");

                    b.ToTable("meeting_attendee");
                });

            modelBuilder.Entity("ReformaAgraria.Models.MeetingMinute", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<string>("Attachment")
                        .HasColumnName("attachment");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnName("date_created");

                    b.Property<DateTime?>("DateModified")
                        .HasColumnName("date_modified");

                    b.Property<string>("Description")
                        .HasColumnName("description");

                    b.Property<int>("FkEventId")
                        .HasColumnName("fk_event_id");

                    b.HasKey("Id")
                        .HasName("pk_meeting_report");

                    b.HasIndex("FkEventId")
                        .HasName("ix_meeting_report_fk_event_id");

                    b.ToTable("meeting_report");
                });

            modelBuilder.Entity("ReformaAgraria.Models.PoliciesDocument", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<string>("Attachment")
                        .HasColumnName("attachment");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnName("date_created");

                    b.Property<DateTime?>("DateModified")
                        .HasColumnName("date_modified");

                    b.Property<string>("Title")
                        .HasColumnName("title");

                    b.HasKey("Id")
                        .HasName("pk_policies_document");

                    b.ToTable("policies_document");
                });

            modelBuilder.Entity("ReformaAgraria.Models.ReformaAgrariaUser", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnName("access_failed_count");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnName("concurrency_stamp");

                    b.Property<string>("Email")
                        .HasColumnName("email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnName("email_confirmed");

                    b.Property<string>("FullName")
                        .HasColumnName("full_name");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnName("lockout_enabled");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnName("lockout_end");

                    b.Property<string>("NormalizedEmail")
                        .HasColumnName("normalized_email")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasColumnName("normalized_user_name")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash")
                        .HasColumnName("password_hash");

                    b.Property<string>("PhoneNumber")
                        .HasColumnName("phone_number");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnName("phone_number_confirmed");

                    b.Property<string>("SecurityStamp")
                        .HasColumnName("security_stamp");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnName("two_factor_enabled");

                    b.Property<string>("UserName")
                        .HasColumnName("user_name")
                        .HasMaxLength(256);

                    b.HasKey("Id")
                        .HasName("pk_asp_net_users");

                    b.HasIndex("NormalizedEmail")
                        .HasName("email_index");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("user_name_index");

                    b.ToTable("asp_net_users");
                });

            modelBuilder.Entity("ReformaAgraria.Models.Region", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnName("id");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnName("date_created");

                    b.Property<DateTime?>("DateModified")
                        .HasColumnName("date_modified");

                    b.Property<string>("FkParentId")
                        .HasColumnName("fk_parent_id");

                    b.Property<bool>("IsKelurahan")
                        .HasColumnName("is_kelurahan");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnName("name");

                    b.Property<int>("Type")
                        .HasColumnName("type");

                    b.HasKey("Id")
                        .HasName("pk_region");

                    b.HasIndex("FkParentId")
                        .HasName("ix_region_fk_parent_id");

                    b.ToTable("region");
                });

            modelBuilder.Entity("ReformaAgraria.Models.TipologyOfAgrarianProblem", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<int>("Codefication")
                        .HasColumnName("codefication");

                    b.Property<bool>("CommunalSubjectDataCheckList")
                        .HasColumnName("communal_subject_data_check_list");

                    b.Property<string>("ContactPerson")
                        .HasColumnName("contact_person");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnName("date_created");

                    b.Property<DateTime?>("DateModified")
                        .HasColumnName("date_modified");

                    b.Property<decimal>("FarmSize")
                        .HasColumnName("farm_size");

                    b.Property<decimal>("FieldSize")
                        .HasColumnName("field_size");

                    b.Property<int?>("FkCoordinateId")
                        .HasColumnName("fk_coordinate_id");

                    b.Property<string>("FkRegionId")
                        .HasColumnName("fk_region_id");

                    b.Property<decimal>("ForestSize")
                        .HasColumnName("forest_size");

                    b.Property<decimal>("GardenSize")
                        .HasColumnName("garden_size");

                    b.Property<decimal>("HabitationSize")
                        .HasColumnName("habitation_size");

                    b.Property<bool>("IndividualSubjectDataCheckList")
                        .HasColumnName("individual_subject_data_check_list");

                    b.Property<bool>("LandTenureHistoryDataCheckList")
                        .HasColumnName("land_tenure_history_data_check_list");

                    b.Property<int>("LandType")
                        .HasColumnName("land_type");

                    b.Property<string>("MainProblem")
                        .HasColumnName("main_problem");

                    b.Property<decimal>("MereSize")
                        .HasColumnName("mere_size");

                    b.Property<bool>("ObjectDataCheckList")
                        .HasColumnName("object_data_check_list");

                    b.Property<decimal>("PaddyFieldSize")
                        .HasColumnName("paddy_field_size");

                    b.Property<decimal>("ProposedSize")
                        .HasColumnName("proposed_size");

                    b.Property<int>("ProposedTreatment")
                        .HasColumnName("proposed_treatment");

                    b.Property<decimal>("Size")
                        .HasColumnName("size");

                    b.Property<int>("TotalFamily")
                        .HasColumnName("total_family");

                    b.Property<int>("TotalPeople")
                        .HasColumnName("total_people");

                    b.HasKey("Id")
                        .HasName("pk_tipology_of_agrarian_problem");

                    b.HasIndex("FkCoordinateId")
                        .HasName("ix_tipology_of_agrarian_problem_fk_coordinate_id");

                    b.HasIndex("FkRegionId")
                        .HasName("ix_tipology_of_agrarian_problem_fk_region_id");

                    b.ToTable("tipology_of_agrarian_problem");
                });

            modelBuilder.Entity("ReformaAgraria.Models.ToraMap", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnName("date_created");

                    b.Property<DateTime?>("DateModified")
                        .HasColumnName("date_modified");

                    b.Property<string>("FkRegionId")
                        .HasColumnName("fk_region_id");

                    b.Property<string>("Geojson")
                        .HasColumnName("geojson");

                    b.Property<string>("Name")
                        .HasColumnName("name");

                    b.HasKey("Id")
                        .HasName("pk_tora_map");

                    b.HasIndex("FkRegionId")
                        .HasName("ix_tora_map_fk_region_id");

                    b.ToTable("tora_map");
                });

            modelBuilder.Entity("ReformaAgraria.Models.ToraMapAttribute", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<string>("Attachment")
                        .HasColumnName("attachment");

                    b.Property<int>("BorderSettingStatus")
                        .HasColumnName("border_setting_status");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnName("date_created");

                    b.Property<DateTime?>("DateModified")
                        .HasColumnName("date_modified");

                    b.Property<int?>("FkCoordinateId")
                        .HasColumnName("fk_coordinate_id");

                    b.Property<string>("FkRegionId")
                        .HasColumnName("fk_region_id");

                    b.Property<decimal>("Size")
                        .HasColumnName("size");

                    b.Property<int>("ToraSettingProcessStage")
                        .HasColumnName("tora_setting_process_stage");

                    b.HasKey("Id")
                        .HasName("pk_tora_map_attribute");

                    b.HasIndex("FkCoordinateId")
                        .HasName("ix_tora_map_attribute_fk_coordinate_id");

                    b.HasIndex("FkRegionId")
                        .HasName("ix_tora_map_attribute_fk_region_id");

                    b.ToTable("tora_map_attribute");
                });

            modelBuilder.Entity("ReformaAgraria.Models.ToraObject", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<string>("ConflictChronology")
                        .HasColumnName("conflict_chronology");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnName("date_created");

                    b.Property<DateTime?>("DateModified")
                        .HasColumnName("date_modified");

                    b.Property<string>("FkRegionId")
                        .HasColumnName("fk_region_id");

                    b.Property<string>("FormalAdvocacyProgress")
                        .HasColumnName("formal_advocacy_progress");

                    b.Property<int>("LandStatus")
                        .HasColumnName("land_status");

                    b.Property<string>("LandTenureHistory")
                        .HasColumnName("land_tenure_history");

                    b.Property<string>("LandType")
                        .HasColumnName("land_type");

                    b.Property<string>("Livelihood")
                        .HasColumnName("livelihood");

                    b.Property<string>("Name")
                        .HasColumnName("name");

                    b.Property<string>("NonFormalAdvocacyProgress")
                        .HasColumnName("non_formal_advocacy_progress");

                    b.Property<string>("ProposedTreatment")
                        .HasColumnName("proposed_treatment");

                    b.Property<int>("RegionalStatus")
                        .HasColumnName("regional_status");

                    b.Property<decimal>("Size")
                        .HasColumnName("size");

                    b.Property<string>("TotalTenants")
                        .HasColumnName("total_tenants");

                    b.HasKey("Id")
                        .HasName("pk_tora_object");

                    b.HasIndex("FkRegionId")
                        .HasName("ix_tora_object_fk_region_id");

                    b.ToTable("tora_object");
                });

            modelBuilder.Entity("ReformaAgraria.Models.ToraSubject", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<string>("Address")
                        .HasColumnName("address");

                    b.Property<int?>("Age")
                        .HasColumnName("age");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnName("date_created");

                    b.Property<DateTime?>("DateModified")
                        .HasColumnName("date_modified");

                    b.Property<int>("EducationalAttainment")
                        .HasColumnName("educational_attainment");

                    b.Property<int>("FkToraObjectId")
                        .HasColumnName("fk_tora_object_id");

                    b.Property<int>("Gender")
                        .HasColumnName("gender");

                    b.Property<string>("LandLocation")
                        .HasColumnName("land_location");

                    b.Property<int>("LandStatus")
                        .HasColumnName("land_status");

                    b.Property<int>("MaritalStatus")
                        .HasColumnName("marital_status");

                    b.Property<string>("Name")
                        .HasColumnName("name");

                    b.Property<string>("Notes")
                        .HasColumnName("notes");

                    b.Property<string>("PlantTypes")
                        .HasColumnName("plant_types");

                    b.Property<decimal>("Size")
                        .HasColumnName("size");

                    b.Property<int>("TotalFamilyMembers")
                        .HasColumnName("total_family_members");

                    b.HasKey("Id")
                        .HasName("pk_tora_subject");

                    b.HasIndex("FkToraObjectId")
                        .HasName("ix_tora_subject_fk_tora_object_id");

                    b.ToTable("tora_subject");
                });

            modelBuilder.Entity("ReformaAgraria.Models.ToraSubmission", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<string>("Attachment")
                        .HasColumnName("attachment");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnName("date_created");

                    b.Property<DateTime?>("DateModified")
                        .HasColumnName("date_modified");

                    b.HasKey("Id")
                        .HasName("pk_tora_submission");

                    b.ToTable("tora_submission");
                });

            modelBuilder.Entity("ReformaAgraria.Models.VillageProfile", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnName("date_created");

                    b.Property<DateTime?>("DateModified")
                        .HasColumnName("date_modified");

                    b.Property<string>("FkRegionId")
                        .HasColumnName("fk_region_id");

                    b.Property<string>("History")
                        .HasColumnName("history");

                    b.Property<string>("Potential")
                        .HasColumnName("potential");

                    b.Property<string>("TenurialCondition")
                        .HasColumnName("tenurial_condition");

                    b.HasKey("Id")
                        .HasName("pk_village_profile");

                    b.HasIndex("FkRegionId")
                        .HasName("ix_village_profile_fk_region_id");

                    b.ToTable("village_profile");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .HasConstraintName("fk_asp_net_role_claims_asp_net_roles_role_id")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("ReformaAgraria.Models.ReformaAgrariaUser")
                        .WithMany("Claims")
                        .HasForeignKey("UserId")
                        .HasConstraintName("fk_asp_net_user_claims_asp_net_users_user_id")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("ReformaAgraria.Models.ReformaAgrariaUser")
                        .WithMany("Logins")
                        .HasForeignKey("UserId")
                        .HasConstraintName("fk_asp_net_user_logins_asp_net_users_user_id")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .HasConstraintName("fk_asp_net_user_roles_asp_net_roles_role_id")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ReformaAgraria.Models.ReformaAgrariaUser")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .HasConstraintName("fk_asp_net_user_roles_asp_net_users_user_id")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("ReformaAgraria.Models.ReformaAgrariaUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .HasConstraintName("fk_asp_net_user_tokens_asp_net_users_user_id")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ReformaAgraria.Models.ActProposalDocumentCheckList", b =>
                {
                    b.HasOne("ReformaAgraria.Models.Region", "Region")
                        .WithMany()
                        .HasForeignKey("FkRegionId")
                        .HasConstraintName("fk_act_proposal_document_check_list_region_fk_region_id");
                });

            modelBuilder.Entity("ReformaAgraria.Models.MeetingAttendee", b =>
                {
                    b.HasOne("ReformaAgraria.Models.MeetingMinute")
                        .WithMany("MeetingAttendees")
                        .HasForeignKey("MeetingMinuteId")
                        .HasConstraintName("fk_meeting_attendee_meeting_report_meeting_minute_id");
                });

            modelBuilder.Entity("ReformaAgraria.Models.MeetingMinute", b =>
                {
                    b.HasOne("ReformaAgraria.Models.Event", "Event")
                        .WithMany()
                        .HasForeignKey("FkEventId")
                        .HasConstraintName("fk_meeting_report_event_fk_event_id")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ReformaAgraria.Models.Region", b =>
                {
                    b.HasOne("ReformaAgraria.Models.Region", "Parent")
                        .WithMany()
                        .HasForeignKey("FkParentId")
                        .HasConstraintName("fk_region_region_fk_parent_id");
                });

            modelBuilder.Entity("ReformaAgraria.Models.TipologyOfAgrarianProblem", b =>
                {
                    b.HasOne("ReformaAgraria.Models.Coordinate", "Coordinate")
                        .WithMany()
                        .HasForeignKey("FkCoordinateId")
                        .HasConstraintName("fk_tipology_of_agrarian_problem_coordinate_fk_coordinate_id");

                    b.HasOne("ReformaAgraria.Models.Region", "Region")
                        .WithMany()
                        .HasForeignKey("FkRegionId")
                        .HasConstraintName("fk_tipology_of_agrarian_problem_region_fk_region_id");
                });

            modelBuilder.Entity("ReformaAgraria.Models.ToraMap", b =>
                {
                    b.HasOne("ReformaAgraria.Models.Region", "Region")
                        .WithMany()
                        .HasForeignKey("FkRegionId")
                        .HasConstraintName("fk_tora_map_region_fk_region_id");
                });

            modelBuilder.Entity("ReformaAgraria.Models.ToraMapAttribute", b =>
                {
                    b.HasOne("ReformaAgraria.Models.Coordinate", "Coordinate")
                        .WithMany()
                        .HasForeignKey("FkCoordinateId")
                        .HasConstraintName("fk_tora_map_attribute_coordinate_fk_coordinate_id");

                    b.HasOne("ReformaAgraria.Models.Region", "Region")
                        .WithMany()
                        .HasForeignKey("FkRegionId")
                        .HasConstraintName("fk_tora_map_attribute_region_fk_region_id");
                });

            modelBuilder.Entity("ReformaAgraria.Models.ToraObject", b =>
                {
                    b.HasOne("ReformaAgraria.Models.Region", "Region")
                        .WithMany()
                        .HasForeignKey("FkRegionId")
                        .HasConstraintName("fk_tora_object_region_fk_region_id");
                });

            modelBuilder.Entity("ReformaAgraria.Models.ToraSubject", b =>
                {
                    b.HasOne("ReformaAgraria.Models.ToraObject", "ToraObject")
                        .WithMany()
                        .HasForeignKey("FkToraObjectId")
                        .HasConstraintName("fk_tora_subject_tora_object_fk_tora_object_id")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ReformaAgraria.Models.VillageProfile", b =>
                {
                    b.HasOne("ReformaAgraria.Models.Region", "Region")
                        .WithMany()
                        .HasForeignKey("FkRegionId")
                        .HasConstraintName("fk_village_profile_region_fk_region_id");
                });
#pragma warning restore 612, 618
        }
    }
}
