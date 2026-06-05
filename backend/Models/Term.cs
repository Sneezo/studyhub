namespace StudyHub.Models;

public class Term
{
    public int Id { get; set; }

    public string TermName { get; set; } = "";
    public string Description { get; set; } = "";
    public string Definition { get; set; } = "";

    public ICollection<TermSubject> TermSubjects { get; set; } = new List<TermSubject>();
    public ICollection<ReviewFlag> ReviewFlags { get; set; } = new List<ReviewFlag>();
}