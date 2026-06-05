namespace StudyHub.Models;

public class TermSubject
{
    public int TermId { get; set; }
    public Term? Term { get; set; }

    public string SubjectId { get; set; } = "";
    public Subject? Subject { get; set; }
}