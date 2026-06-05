namespace StudyHub.Models;

public class ReviewFlag
{
    public int Id { get; set; }

    public int TermId { get; set; }
    public Term? Term { get; set; }

    public string SubjectId { get; set; } = "";
    public Subject? Subject { get; set; }

    public string TermSnapshot { get; set; } = "";
    public string Note { get; set; } = "";
    public string Status { get; set; } = "open";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}