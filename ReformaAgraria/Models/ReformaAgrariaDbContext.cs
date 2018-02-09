using EntityFrameworkCore.Triggers;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MicrovacWebCore;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public class ReformaAgrariaDbContext : IdentityDbContext<ReformaAgrariaUser>
    {     
        public ReformaAgrariaDbContext(DbContextOptions<ReformaAgrariaDbContext> options) : base(options)
        {
        }

        static ReformaAgrariaDbContext()
        {
            AddTriggers();
        }

        public DbSet<Region> Region { get; set; }
        public DbSet<ToraMap> ToraMap { get; set; }
        public DbSet<ToraMapAttribute> ToraMapAttribute { get; set; }
        public DbSet<Event> Event { get; set; }
        public DbSet<Library> Library { get; set; }
        public DbSet<ToraObject> ToraObject { get; set; }
        public DbSet<ToraSubject> ToraSubject { get; set; }
        public DbSet<ToraSubmission> ToraSubmission { get; set; }
        public DbSet<ActProposalDocumentCheckList> ActProposalDocumentCheckList { get; set; }
        public DbSet<VillageProfile> VillageProfile { get; set; }
        public DbSet<TipologyOfAgrarianProblem> TipologyOfAgrarianProblem { get; set; }
        public DbSet<BaseLayer> BaseLayer { get; set; }

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

            foreach (var entity in builder.Model.GetEntityTypes())
            {
                // Replace table names
                entity.Relational().TableName = entity.Relational().TableName.ToSnakeCase();

                // Replace column names
                foreach (var property in entity.GetProperties())
                {
                    property.Relational().ColumnName = property.Name.ToSnakeCase();
                }

                foreach (var key in entity.GetKeys())
                {
                    key.Relational().Name = key.Relational().Name.ToSnakeCase();
                }

                foreach (var key in entity.GetForeignKeys())
                {
                    key.Relational().Name = key.Relational().Name.ToSnakeCase();
                }

                foreach (var index in entity.GetIndexes())
                {
                    index.Relational().Name = index.Relational().Name.ToSnakeCase();
                }
            }
        }

        public override int SaveChanges()
        {
            AddTimestamps();
            return this.SaveChangesWithTriggers(base.SaveChanges, acceptAllChangesOnSuccess: true);
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            AddTimestamps();
            return this.SaveChangesWithTriggers(base.SaveChanges, acceptAllChangesOnSuccess);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            AddTimestamps();
            return this.SaveChangesWithTriggersAsync(base.SaveChangesAsync, acceptAllChangesOnSuccess: true, cancellationToken: cancellationToken);
        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            AddTimestamps();
            return this.SaveChangesWithTriggersAsync(base.SaveChangesAsync, acceptAllChangesOnSuccess, cancellationToken);
        }

        private static void AddTriggers()
        {
            Triggers<ToraSubject>.Inserting += entry =>
            {
                var toraObject = entry.Context.Set<ToraObject>().First(to => to.Id == entry.Entity.FkToraObjectId);
                toraObject.TotalSubjects += 1;
                entry.Context.Update(toraObject);
            };

            Triggers<ToraSubject>.Deleting += entry =>
            {
                var toraObjectId = entry.Context.Set<ToraSubject>()
                    .Where(ts => ts.Id == entry.Entity.Id)
                    .Select(ts => ts.FkToraObjectId)
                    .First();
                var toraObject = entry.Context.Set<ToraObject>().First(to => to.Id == toraObjectId);
                toraObject.TotalSubjects -= 1;
                entry.Context.Update(toraObject);
            };

            Triggers<ToraMap>.Inserting += entry =>
            {
                var toraObject = entry.Context.Set<ToraObject>().First(to => to.Id == entry.Entity.FkToraObjectId);
                toraObject.Size += entry.Entity.Size;
                entry.Context.Update(toraObject);
            };

            Triggers<ToraMap>.Deleting += entry =>
            {
                var toraMapSize = entry.Context.Set<ToraMap>()
                    .Where(tm => tm.Id == entry.Entity.Id)
                    .Select(tm => tm.Size)
                    .First();
                var toraObject = entry.Context.Set<ToraObject>().FirstOrDefault(to => to.Id == entry.Entity.FkToraObjectId);
                toraObject.Size -= entry.Entity.Size;
                entry.Context.Update(toraObject);
            };
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

    public static class StringExtensions
    {
        public static string ToSnakeCase(this string input)
        {
            if (string.IsNullOrEmpty(input)) { return input; }

            var startUnderscores = Regex.Match(input, @"^_+");
            return startUnderscores + Regex.Replace(input, @"([a-z0-9])([A-Z])", "$1_$2").ToLower();
        }
    }
}