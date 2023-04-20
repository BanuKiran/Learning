using HR.LeaveManagement.Domain;
using HR.LeaveManagement.Domain.Common;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ProductService.Models;
using UserService1.Models;
using WorldCitiesAPI.Data.Models;

namespace WorldCitiesAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {

        public ApplicationDbContext() : base()
        {
        }

        public ApplicationDbContext(DbContextOptions options)
         : base(options)
        {
        }

        /// <summary>
        /// IMPORTANT NOTE: the following method override is redundant 
        /// (since we've already configured our entities using Data Annotations)
        /// and has been left there for demonstration purposes only.
        /// See "Entity Types configuration methods" in Chapter 4 for details.
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<City>().ToTable("Cities");
            modelBuilder.Entity<City>()
                .HasKey(x => x.Id);
            modelBuilder.Entity<City>()
                .Property(x => x.Id).IsRequired();
            modelBuilder.Entity<City>()
                .Property(x => x.Lat).HasColumnType("decimal(7,4)");
            modelBuilder.Entity<City>()
                .Property(x => x.Lon).HasColumnType("decimal(7,4)");

            modelBuilder.Entity<Country>().ToTable("Countries");
            modelBuilder.Entity<Country>()
                .HasKey(x => x.Id);
            modelBuilder.Entity<Country>()
                .Property(x => x.Id).IsRequired();
            modelBuilder.Entity<City>()
                .HasOne(x => x.Country)
                .WithMany(y => y.Cities)
                .HasForeignKey(x => x.CountryId);

            // add the EntityTypeConfiguration classes
            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(ApplicationDbContext).Assembly
                );

            modelBuilder.Entity<User>()
                .HasMany(u => u.Purchases)
                .WithOne(p => p.User);

            modelBuilder.Entity<Purchase>()
                .Property(p => p.ProductId)
                .HasConversion(v => JsonConvert.SerializeObject(v), v => JsonConvert.DeserializeObject<Guid>(v));
        }

        public DbSet<City> Cities => Set<City>();
        public DbSet<Country> Countries => Set<Country>();

        public DbSet<LeaveRequest> LeaveRequests { get; set; }
        public DbSet<LeaveType> LeaveTypes { get; set; }
        public DbSet<LeaveAllocation> LeaveAllocations { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<Purchase> Purchases { get; set; }

        public virtual async Task<int> SaveChangesAsync(string username = "SYSTEM")
        {
            foreach (var entry in base.ChangeTracker.Entries<BaseDomainEntity>()
                .Where(q => q.State == EntityState.Added || q.State == EntityState.Modified))
            {
                entry.Entity.LastModifiedDate = DateTime.Now;
                entry.Entity.LastModifiedBy = username;

                if (entry.State == EntityState.Added)
                {
                    entry.Entity.DateCreated = DateTime.Now;
                    entry.Entity.CreatedBy = username;
                }
            }

            var result = await base.SaveChangesAsync();

            return result;
        }
    }
}
