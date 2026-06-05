using Microsoft.EntityFrameworkCore;
using StudyHub.Models;

namespace StudyHub.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (!await db.ClassGroups.AnyAsync())
        {
            db.ClassGroups.AddRange(
                new ClassGroup { Code = "SN", Name = "Server and Network" },
                new ClassGroup { Code = "DS", Name = "Data and Security" }
            );

            await db.SaveChangesAsync();
        }

        if (!await db.Subjects.AnyAsync())
        {
            db.Subjects.AddRange(
                new Subject
                {
                    Id = "network",
                    Name = "Network",
                    Description = "Network fundamentals, IP addressing, routing, switching and troubleshooting."
                },
                new Subject
                {
                    Id = "linux",
                    Name = "Linux",
                    Description = "Linux command line, users, permissions, services and server administration."
                },
                new Subject
                {
                    Id = "windows-server",
                    Name = "Windows Server",
                    Description = "Active Directory, DNS, DHCP, Group Policy, Hyper-V and Windows Server management."
                },
                new Subject
                {
                    Id = "security",
                    Name = "Security",
                    Description = "Cybersecurity, attacks, defense, encryption, hardening and incident response."
                },
                new Subject
                {
                    Id = "databases",
                    Name = "Databases",
                    Description = "Database design, SQL, normalization and database-driven applications."
                },
                new Subject
                {
                    Id = "virtualization",
                    Name = "Virtualization",
                    Description = "Virtual machines, hypervisors, storage, networking and server infrastructure."
                },
                new Subject
                {
                    Id = "scripting",
                    Name = "Scripting",
                    Description = "PowerShell, Bash, automation and practical scripting for IT operations."
                }
            );

            db.SubjectClassGroups.AddRange(
                new SubjectClassGroup { SubjectId = "network", ClassGroupCode = "SN" },
                new SubjectClassGroup { SubjectId = "network", ClassGroupCode = "DS" },

                new SubjectClassGroup { SubjectId = "linux", ClassGroupCode = "SN" },
                new SubjectClassGroup { SubjectId = "linux", ClassGroupCode = "DS" },

                new SubjectClassGroup { SubjectId = "windows-server", ClassGroupCode = "SN" },

                new SubjectClassGroup { SubjectId = "security", ClassGroupCode = "DS" },

                new SubjectClassGroup { SubjectId = "databases", ClassGroupCode = "DS" },

                new SubjectClassGroup { SubjectId = "virtualization", ClassGroupCode = "SN" },

                new SubjectClassGroup { SubjectId = "scripting", ClassGroupCode = "SN" },
                new SubjectClassGroup { SubjectId = "scripting", ClassGroupCode = "DS" }
            );

            await db.SaveChangesAsync();
        }

        if (await db.Terms.AnyAsync())
        {
            return;
        }

        db.Terms.AddRange(
            CreateTerm(
                "DHCP",
                "Automatically gives devices IP configuration.",
                "Dynamic Host Configuration Protocol is used to automatically assign IP addresses, subnet masks, default gateways and DNS servers to network clients.",
                "network",
                "windows-server"
            ),
            CreateTerm(
                "DNS",
                "Translates names into IP addresses.",
                "Domain Name System is the service that translates human-readable names like studyhub.local into IP addresses that computers can use.",
                "network",
                "windows-server",
                "linux"
            ),
            CreateTerm(
                "Active Directory",
                "Centralized identity and resource management.",
                "Active Directory is Microsoft's directory service for managing users, computers, groups and policies in a Windows domain environment.",
                "windows-server"
            ),
            CreateTerm(
                "Group Policy",
                "Centralized configuration for users and computers.",
                "Group Policy allows administrators to centrally configure settings, security rules, scripts and restrictions for users and computers in an Active Directory domain.",
                "windows-server",
                "security"
            ),
            CreateTerm(
                "chmod",
                "Changes file permissions in Linux.",
                "chmod is a Linux command used to change file and directory permissions, such as read, write and execute access for owner, group and others.",
                "linux",
                "security"
            ),
            CreateTerm(
                "SSH",
                "Secure remote command-line access.",
                "Secure Shell is a protocol used to securely connect to remote systems over a network, usually for command-line administration.",
                "linux",
                "network",
                "security"
            ),
            CreateTerm(
                "SQL",
                "Language used to work with relational databases.",
                "Structured Query Language is used to create, read, update and delete data in relational database systems.",
                "databases"
            )
        );

        await db.SaveChangesAsync();
    }

    private static Term CreateTerm(
        string termName,
        string description,
        string definition,
        params string[] subjectIds)
    {
        var term = new Term
        {
            TermName = termName,
            Description = description,
            Definition = definition
        };

        foreach (var subjectId in subjectIds)
        {
            term.TermSubjects.Add(new TermSubject
            {
                SubjectId = subjectId
            });
        }

        return term;
    }
}