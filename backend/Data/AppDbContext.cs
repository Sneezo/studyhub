using Microsoft.EntityFrameworkCore;
using StudyHub.Models;

namespace StudyHub.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<ClassGroup> ClassGroups => Set<ClassGroup>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<SubjectClassGroup> SubjectClassGroups => Set<SubjectClassGroup>();
    public DbSet<Term> Terms => Set<Term>();
    public DbSet<TermSubject> TermSubjects => Set<TermSubject>();
    public DbSet<ReviewFlag> ReviewFlags => Set<ReviewFlag>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ClassGroup>(entity =>
        {
            entity.HasKey(classGroup => classGroup.Code);

            entity.Property(classGroup => classGroup.Code)
                .HasMaxLength(20);

            entity.Property(classGroup => classGroup.Name)
                .HasMaxLength(100)
                .IsRequired();
        });

        modelBuilder.Entity<Subject>(entity =>
        {
            entity.HasKey(subject => subject.Id);

            entity.Property(subject => subject.Id)
                .HasMaxLength(100);

            entity.Property(subject => subject.Name)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(subject => subject.Description)
                .HasMaxLength(500)
                .IsRequired();
        });

        modelBuilder.Entity<SubjectClassGroup>(entity =>
        {
            entity.HasKey(item => new { item.SubjectId, item.ClassGroupCode });

            entity.HasOne(item => item.Subject)
                .WithMany(subject => subject.SubjectClassGroups)
                .HasForeignKey(item => item.SubjectId);

            entity.HasOne(item => item.ClassGroup)
                .WithMany(classGroup => classGroup.SubjectClassGroups)
                .HasForeignKey(item => item.ClassGroupCode);
        });

        modelBuilder.Entity<Term>(entity =>
        {
            entity.Property(term => term.TermName)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(term => term.Description)
                .HasMaxLength(300)
                .IsRequired();

            entity.Property(term => term.Definition)
                .HasMaxLength(2000)
                .IsRequired();
        });

        modelBuilder.Entity<TermSubject>(entity =>
        {
            entity.HasKey(item => new { item.TermId, item.SubjectId });

            entity.HasOne(item => item.Term)
                .WithMany(term => term.TermSubjects)
                .HasForeignKey(item => item.TermId);

            entity.HasOne(item => item.Subject)
                .WithMany(subject => subject.TermSubjects)
                .HasForeignKey(item => item.SubjectId);
        });

        modelBuilder.Entity<ReviewFlag>(entity =>
        {
            entity.Property(flag => flag.TermSnapshot)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(flag => flag.Note)
                .HasMaxLength(1000)
                .IsRequired();

            entity.Property(flag => flag.Status)
                .HasMaxLength(30)
                .IsRequired();

            entity.HasOne(flag => flag.Term)
                .WithMany(term => term.ReviewFlags)
                .HasForeignKey(flag => flag.TermId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(flag => flag.Subject)
                .WithMany()
                .HasForeignKey(flag => flag.SubjectId)
                .OnDelete(DeleteBehavior.NoAction);
        });
    }
}