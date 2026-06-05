namespace StudyHub.Models;

public class SubjectClassGroup
{
    public string SubjectId { get; set; } = "";
    public Subject? Subject { get; set; }

    public string ClassGroupCode { get; set; } = "";
    public ClassGroup? ClassGroup { get; set; }
}