using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ReformaAgraria.Models
{
    public class ReformaAgrariaDbContext : IdentityDbContext<ReformaAgrariaUser>
    {
        public ReformaAgrariaDbContext(DbContextOptions<ReformaAgrariaDbContext> options) : base(options)
        {
        }

        public DbSet<Region> Region { get; set; }
        public DbSet<VillageMapAttribute> VillageMapAttribute { get; set; }
        public DbSet<ToraMapAttribute> ToraMapAttribute { get; set; }
        public DbSet<WorkCalendar> WorkCalendar { get; set; }
        public DbSet<PoliciesDocuments> PoliciesDocuments { get; set; }
        public DbSet<MeetingReport> MeetingReport { get; set; }
        public DbSet<ObjectSubjectTora> ObjectSubjectTora { get; set; }
        public DbSet<ToraSubmission> ToraSubmission { get; set; }
        public DbSet<ProposalOfActDocumentCheckList> ProposalOfActDocumentCheckList { get; set; }
        public DbSet<ProfileOfVillage> ProfileOfVillage { get; set; }
        public DbSet<TipologyOfAgrarianProblem> TipologyOfAgrarianProblem { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ReformaAgrariaUser>()
               .HasMany(e => e.Claims)
               .WithOne()
               .HasForeignKey(e => e.UserId)
               .IsRequired()
               .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ReformaAgrariaUser>()
                .HasMany(e => e.Logins)
                .WithOne()
                .HasForeignKey(e => e.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ReformaAgrariaUser>()
                .HasMany(e => e.Roles)
                .WithOne()
                .HasForeignKey(e => e.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Region>().ToTable("Region");
            builder.Entity<VillageMapAttribute>().ToTable("VillageMapAttribute");
            builder.Entity<ToraMapAttribute>().ToTable("ToraMapAttribute");
            builder.Entity<WorkCalendar>().ToTable("WorkCalendar");
            builder.Entity<PoliciesDocuments>().ToTable("PoliciesDocuments");
            builder.Entity<MeetingReport>().ToTable("MeetingReport");
            builder.Entity<ObjectSubjectTora>().ToTable("ObjectSubjectTora");
            builder.Entity<ToraSubmission>().ToTable("ToraSubmission");
            builder.Entity<ProposalOfActDocumentCheckList>().ToTable("ProposalOfActDocumentCheckList");
            builder.Entity<ProfileOfVillage>().ToTable("ProfileOfVillage");
            builder.Entity<TipologyOfAgrarianProblem>().ToTable("TipologyOfAgrarianProblem");
        }
    }
}