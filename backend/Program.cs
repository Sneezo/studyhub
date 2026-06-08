using Microsoft.EntityFrameworkCore;
using StudyHub.Data;
using StudyHub.Models;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.Extensions.FileProviders;

const string CmsTeacherGroup = @"BLIX\StudyHubTeachers";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", policy =>
    {
        policy
        .WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddAuthentication(IISDefaults.AuthenticationScheme);

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AuthenticatedOnly", policy =>
    {
        policy.RequireAuthenticatedUser();
    });

    options.AddPolicy("CmsOnly", policy =>
    {
        policy.RequireAssertion(context =>
            context.User.Identity?.IsAuthenticated == true &&
            context.User.IsInRole(CmsTeacherGroup)
        );
    });
});

var app = builder.Build();

app.UseCors("FrontendDev");

var webRootPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot");

app.UseDefaultFiles(new DefaultFilesOptions
{
    FileProvider = new PhysicalFileProvider(webRootPath)
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(webRootPath)
});

app.UseAuthentication();
app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await db.Database.MigrateAsync();
    await DbInitializer.SeedAsync(db);
}

app.MapGet("/api/health", () => "StudyHub API is running");

// Public endpoints

app.MapGet("/api/public/terms", async (AppDbContext db) =>
{
    var terms = await db.Terms
        .Include(term => term.TermSubjects)
        .OrderBy(term => term.TermName)
        .ToListAsync();

    return Results.Ok(terms.Select(ToDto));
});

app.MapGet("/api/public/terms/by-tag/{tag}", async (string tag, AppDbContext db) =>
{
    var terms = await db.Terms
        .Include(term => term.TermSubjects)
        .Where(term => term.TermSubjects.Any(termSubject => termSubject.SubjectId == tag))
        .OrderBy(term => term.TermName)
        .ToListAsync();

    return Results.Ok(terms.Select(ToDto));
});

app.MapPost("/api/public/review-flags", async (
    CreateReviewFlagRequest request,
    AppDbContext db) =>
{
    var term = await db.Terms
        .FirstOrDefaultAsync(term => term.Id == request.TermId);

    if (term is null)
    {
        return Results.NotFound(new { message = "Term not found." });
    }

    var subjectExists = await db.Subjects
        .AnyAsync(subject => subject.Id == request.SubjectId);

    if (!subjectExists)
    {
        return Results.BadRequest(new { message = "Subject not found." });
    }

    var oldFlags = await db.ReviewFlags
        .Where(flag => flag.TermId == request.TermId)
        .ToListAsync();

    db.ReviewFlags.RemoveRange(oldFlags);

    var reviewFlag = new ReviewFlag
    {
        TermId = request.TermId,
        SubjectId = request.SubjectId,
        TermSnapshot = term.TermName,
        Note = request.Note.Trim(),
        Status = "open",
        CreatedAt = DateTimeOffset.UtcNow
    };

    db.ReviewFlags.Add(reviewFlag);
    await db.SaveChangesAsync();

    var response = new ReviewFlagDto(
        reviewFlag.TermId,
        reviewFlag.TermSnapshot,
        reviewFlag.SubjectId,
        reviewFlag.Note,
        reviewFlag.CreatedAt,
        reviewFlag.Status
    );

    return Results.Created($"/api/cms/review-flags/{reviewFlag.TermId}", response);
});

app.MapGet("/api/cms/me", (HttpContext context) =>
{
    return Results.Ok(new
    {
        isAuthenticated = context.User.Identity?.IsAuthenticated ?? false,
        username = context.User.Identity?.Name,
        authenticationType = context.User.Identity?.AuthenticationType,
        teacherGroup = CmsTeacherGroup,
        isTeacher = context.User.IsInRole(CmsTeacherGroup)
    });
})
.RequireAuthorization("AuthenticatedOnly");

var cms = app.MapGroup("/api/cms")
    .RequireAuthorization("CmsOnly");

// CMS endpoints
// Later we will protect these with Windows Authentication / AD.

cms.MapGet("/terms", async (AppDbContext db) =>
{
    var terms = await db.Terms
        .Include(term => term.TermSubjects)
        .OrderBy(term => term.TermName)
        .ToListAsync();

    return Results.Ok(terms.Select(ToDto));
});

cms.MapGet("/terms/{id:int}", async (int id, AppDbContext db) =>
{
    var term = await db.Terms
        .Include(term => term.TermSubjects)
        .FirstOrDefaultAsync(term => term.Id == id);

    return term is null
        ? Results.NotFound(new { message = "Term not found." })
        : Results.Ok(ToDto(term));
});

cms.MapPost("/terms", async (
    CreateTermRequest request,
    AppDbContext db) =>
{
    var term = new Term
    {
        TermName = request.Term.Trim(),
        Description = request.Description.Trim(),
        Definition = request.Definition.Trim()
    };

    await AddTermSubjectsAsync(term, request.Tags, db);

    db.Terms.Add(term);
    await db.SaveChangesAsync();

    var savedTerm = await db.Terms
        .Include(item => item.TermSubjects)
        .FirstAsync(item => item.Id == term.Id);

    return Results.Created($"/api/cms/terms/{savedTerm.Id}", ToDto(savedTerm));
});

cms.MapPut("/terms/{id:int}", async (
    int id,
    UpdateTermRequest request,
    AppDbContext db) =>
{
    var term = await db.Terms
        .Include(term => term.TermSubjects)
        .FirstOrDefaultAsync(term => term.Id == id);

    if (term is null)
    {
        return Results.NotFound(new { message = "Term not found." });
    }

    term.TermName = request.Term.Trim();
    term.Description = request.Description.Trim();
    term.Definition = request.Definition.Trim();

    term.TermSubjects.Clear();
    await AddTermSubjectsAsync(term, request.Tags, db);

    await db.SaveChangesAsync();

    return Results.Ok(ToDto(term));
});

cms.MapDelete("/terms/{id:int}", async (int id, AppDbContext db) =>
{
    var term = await db.Terms
        .FirstOrDefaultAsync(term => term.Id == id);

    if (term is null)
    {
        return Results.NotFound(new { message = "Term not found." });
    }

    db.Terms.Remove(term);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

cms.MapGet("/review-flags", async (AppDbContext db) =>
{
    var flags = await db.ReviewFlags
        .OrderByDescending(flag => flag.CreatedAt)
        .Select(flag => new ReviewFlagDto(
            flag.TermId,
            flag.TermSnapshot,
            flag.SubjectId,
            flag.Note,
            flag.CreatedAt,
            flag.Status
        ))
        .ToListAsync();

    return Results.Ok(flags);
});

cms.MapDelete("/review-flags/{termId:int}", async (
    int termId,
    AppDbContext db) =>
{
    var flags = await db.ReviewFlags
        .Where(flag => flag.TermId == termId)
        .ToListAsync();

    db.ReviewFlags.RemoveRange(flags);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapGet("/api/debug/static-files", () =>
{
    var indexPath = Path.Combine(webRootPath, "index.html");

    return Results.Ok(new
    {
        contentRootPath = app.Environment.ContentRootPath,
        webRootPath,
        indexPath,
        indexExists = System.IO.File.Exists(indexPath)
    });
});

app.MapFallback(async context =>
{
    if (context.Request.Path.StartsWithSegments("/api"))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        return;
    }

    var indexPath = Path.Combine(webRootPath, "index.html");

    context.Response.ContentType = "text/html";
    await context.Response.SendFileAsync(indexPath);
});

app.Run();

static TermDto ToDto(Term term)
{
    return new TermDto(
        term.Id,
        term.TermName,
        term.TermSubjects.Select(termSubject => termSubject.SubjectId).ToArray(),
        term.Description,
        term.Definition
    );
}

static async Task AddTermSubjectsAsync(
    Term term,
    string[] tags,
    AppDbContext db)
{
    var cleanedTags = tags
        .Select(tag => tag.Trim().ToLowerInvariant())
        .Where(tag => !string.IsNullOrWhiteSpace(tag))
        .Distinct()
        .ToArray();

    foreach (var tag in cleanedTags)
    {
        var subjectExists = await db.Subjects.AnyAsync(subject => subject.Id == tag);

        if (!subjectExists)
        {
            db.Subjects.Add(new Subject
            {
                Id = tag,
                Name = tag,
                Description = $"Auto-created subject/tag: {tag}"
            });
        }

        term.TermSubjects.Add(new TermSubject
        {
            SubjectId = tag
        });
    }
}

public record TermDto(
    int Id,
    string Term,
    string[] Tags,
    string Description,
    string Definition
);

public record CreateTermRequest(
    string Term,
    string[] Tags,
    string Description,
    string Definition
);

public record UpdateTermRequest(
    string Term,
    string[] Tags,
    string Description,
    string Definition
);

public record ReviewFlagDto(
    int TermId,
    string Term,
    string SubjectId,
    string Note,
    DateTimeOffset CreatedAt,
    string Status
);

public record CreateReviewFlagRequest(
    int TermId,
    string SubjectId,
    string Note
);