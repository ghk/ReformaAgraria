using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MicrovacWebCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

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
        public DbSet<PoliciesDocument> PoliciesDocuments { get; set; }
        public DbSet<MeetingMinute> MeetingReport { get; set; }
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
        }

        public override int SaveChanges()
        {
            AddTimestamps();
            return base.SaveChanges();
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            AddTimestamps();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            AddTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            AddTimestamps();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void AddTimestamps()
        {
            var entities = ChangeTracker.Entries().Where(x => x.Entity is IAuditableEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            //var currentUsername = !string.IsNullOrEmpty(System.Web.HttpContext.Current?.User?.Identity?.Name)
            //    ? HttpContext.Current.User.Identity.Name
            //    : "Anonymous";

            foreach (var entity in entities)
            {
                if (entity.State == EntityState.Added)
                {
                    ((IAuditableEntity)entity.Entity).DateCreated = DateTime.UtcNow;
                    //((IAuditableEntity)entity.Entity).UserCreated = currentUsername;
                }

                ((IAuditableEntity)entity.Entity).DateModified = DateTime.UtcNow;
                //((IAuditableEntity)entity.Entity).UserModified = currentUsername;
            }
        }
    }
}