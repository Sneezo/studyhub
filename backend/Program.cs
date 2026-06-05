var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("FrontendDev");

var terms = new List<TermDto>
{
    new(
        1,
        "DHCP",
        new[] { "network", "windows-server" },
        "Automatically gives devices IP configuration.",
        "Dynamic Host Configuration Protocol is used to automatically assign IP addresses, subnet masks, default gateways and DNS servers to network clients."
    ),
    new(
        2,
        "DNS",
        new[] { "network", "windows-server", "linux" },
        "Translates names into IP addresses.",
        "Domain Name System is the service that translates human-readable names like studyhub.local into IP addresses that computers can use."
    ),
    new(
        3,
        "Active Directory",
        new[] { "windows-server" },
        "Centralized identity and resource management.",
        "Active Directory is Microsoft's directory service for managing users, computers, groups and policies in a Windows domain environment."
    ),
    new(
        4,
        "chmod",
        new[] { "linux", "security" },
        "Changes file permissions in Linux.",
        "chmod is a Linux command used to change file and directory permissions, such as read, write and execute access."
    ),
    new(
        5,
        "SQL",
        new[] { "databases" },
        "Language used to work with relational databases.",
        "Structured Query Language is used to create, read, update and delete data in relational database systems."
    )
};

var reviewFlags = new List<ReviewFlagDto>();

app.MapGet("/", () => "StudyHub API is running");

// Public endpoints

app.MapGet("/api/public/terms", () =>
{
    return Results.Ok(terms);
});

app.MapGet("/api/public/terms/by-tag/{tag}", (string tag) =>
{
    var matchingTerms = terms
        .Where(term => term.Tags.Contains(tag, StringComparer.OrdinalIgnoreCase))
        .ToList();

    return Results.Ok(matchingTerms);
});

app.MapPost("/api/public/review-flags", (CreateReviewFlagRequest request) =>
{
    var term = terms.FirstOrDefault(term => term.Id == request.TermId);

    if (term is null)
    {
        return Results.NotFound(new { message = "Term not found." });
    }

    var existingFlag = reviewFlags.FirstOrDefault(flag => flag.TermId == request.TermId);

    if (existingFlag is not null)
    {
        reviewFlags.Remove(existingFlag);
    }

    var newFlag = new ReviewFlagDto(
        request.TermId,
        term.Term,
        request.SubjectId,
        request.Note,
        DateTimeOffset.UtcNow,
        "open"
    );

    reviewFlags.Add(newFlag);

    return Results.Created($"/api/cms/review-flags/{newFlag.TermId}", newFlag);
});

// CMS endpoints

app.MapGet("/api/cms/terms", () =>
{
    return Results.Ok(terms);
});

app.MapGet("/api/cms/terms/{id:int}", (int id) =>
{
    var term = terms.FirstOrDefault(term => term.Id == id);

    return term is null
        ? Results.NotFound(new { message = "Term not found." })
        : Results.Ok(term);
});

app.MapPost("/api/cms/terms", (CreateTermRequest request) =>
{
    var nextId = terms.Count == 0
        ? 1
        : terms.Max(term => term.Id) + 1;

    var newTerm = new TermDto(
        nextId,
        request.Term.Trim(),
        request.Tags,
        request.Description.Trim(),
        request.Definition.Trim()
    );

    terms.Add(newTerm);

    return Results.Created($"/api/cms/terms/{newTerm.Id}", newTerm);
});

app.MapPut("/api/cms/terms/{id:int}", (int id, UpdateTermRequest request) =>
{
    var existingTerm = terms.FirstOrDefault(term => term.Id == id);

    if (existingTerm is null)
    {
        return Results.NotFound(new { message = "Term not found." });
    }

    var updatedTerm = existingTerm with
    {
        Term = request.Term.Trim(),
        Tags = request.Tags,
        Description = request.Description.Trim(),
        Definition = request.Definition.Trim()
    };

    var index = terms.FindIndex(term => term.Id == id);
    terms[index] = updatedTerm;

    return Results.Ok(updatedTerm);
});

app.MapDelete("/api/cms/terms/{id:int}", (int id) =>
{
    var existingTerm = terms.FirstOrDefault(term => term.Id == id);

    if (existingTerm is null)
    {
        return Results.NotFound(new { message = "Term not found." });
    }

    terms.Remove(existingTerm);
    reviewFlags.RemoveAll(flag => flag.TermId == id);

    return Results.NoContent();
});

app.MapGet("/api/cms/review-flags", () =>
{
    return Results.Ok(reviewFlags);
});

app.MapDelete("/api/cms/review-flags/{termId:int}", (int termId) =>
{
    reviewFlags.RemoveAll(flag => flag.TermId == termId);

    return Results.NoContent();
});

app.Run();

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