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
        public DbSet<Event> WorkCalendar { get; set; }
        public DbSet<PoliciesDocuments> PoliciesDocuments { get; set; }
        public DbSet<MeetingMinutes> MeetingReport { get; set; }
        public DbSet<ToraObject> ToraObject { get; set; }
        public DbSet<ToraSubject> ToraSubject { get; set; }
        public DbSet<ToraSubmission> ToraSubmission { get; set; }
        public DbSet<ActProposalDocumentCheckList> ProposalOfActDocumentCheckList { get; set; }
        public DbSet<VillageProfile> ProfileOfVillage { get; set; }
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
            builder.Entity<Event>().ToTable("WorkCalendar");
            builder.Entity<PoliciesDocuments>().ToTable("PoliciesDocuments");
            builder.Entity<MeetingMinutes>().ToTable("MeetingReport");
            builder.Entity<ToraObject>().ToTable("ToraObject");
            builder.Entity<ToraSubject>().ToTable("ToraSubject");
            builder.Entity<ToraSubmission>().ToTable("ToraSubmission");
            builder.Entity<ActProposalDocumentCheckList>().ToTable("ProposalOfActDocumentCheckList");
            builder.Entity<VillageProfile>().ToTable("ProfileOfVillage");
            builder.Entity<TipologyOfAgrarianProblem>().ToTable("TipologyOfAgrarianProblem");
        }
    }
}