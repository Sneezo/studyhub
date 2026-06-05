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

var terms = new List<Term>
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
    )
};

app.MapGet("/", () => "StudyHub API is running");

app.MapGet("/api/public/terms", () =>
{
    return Results.Ok(terms);
});

app.MapGet("/api/public/terms/{id:int}", (int id) =>
{
    var term = terms.FirstOrDefault(term => term.Id == id);

    return term is null
        ? Results.NotFound()
        : Results.Ok(term);
});

app.MapGet("/api/public/terms/by-tag/{tag}", (string tag) =>
{
    var matchingTerms = terms
        .Where(term => term.Tags.Contains(tag, StringComparer.OrdinalIgnoreCase))
        .ToList();

    return Results.Ok(matchingTerms);
});

app.Run();

public record Term(
    int Id,
    string TermName,
    string[] Tags,
    string Description,
    string Definition
);