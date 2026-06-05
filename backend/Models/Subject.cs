namespace StudyHub.Models;

public class Subject
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";

    public ICollection<SubjectClassGroup> SubjectClassGroups { get; set; } = new List<SubjectClassGroup>();
    public ICollection<TermSubject> TermSubjects { get; set; } = new List<TermSubject>();
}