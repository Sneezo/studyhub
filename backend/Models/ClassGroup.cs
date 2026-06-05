namespace StudyHub.Models;

public class ClassGroup
{
    public string Code { get; set; } = "";
    public string Name { get; set; } = "";

    public ICollection<SubjectClassGroup> SubjectClassGroups { get; set; } = new List<SubjectClassGroup>();
}