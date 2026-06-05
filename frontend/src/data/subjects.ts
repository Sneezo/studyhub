export type ClassFilter = "All" | "SN" | "DS";

export type Subject = {
  id: string;
  name: string;
  classes: Array<"SN" | "DS">;
  description: string;
};

export const subjects: Subject[] = [
  {
    id: "network",
    name: "Network",
    classes: ["SN", "DS"],
    description: "Network fundamentals, IP addressing, routing, switching and troubleshooting.",
  },
  {
    id: "linux",
    name: "Linux",
    classes: ["SN", "DS"],
    description: "Linux command line, users, permissions, services and server administration.",
  },
  {
    id: "windows-server",
    name: "Windows Server",
    classes: ["SN"],
    description: "Active Directory, DNS, DHCP, Group Policy, Hyper-V and Windows Server management.",
  },
  {
    id: "security",
    name: "Security",
    classes: ["DS"],
    description: "Cybersecurity, attacks, defense, encryption, hardening and incident response.",
  },
  {
    id: "databases",
    name: "Databases",
    classes: ["DS"],
    description: "Database design, SQL, normalization and database-driven applications.",
  },
  {
    id: "virtualization",
    name: "Virtualization",
    classes: ["SN"],
    description: "Virtual machines, hypervisors, storage, networking and server infrastructure.",
  },
  {
    id: "scripting",
    name: "Scripting",
    classes: ["SN", "DS"],
    description: "PowerShell, Bash, automation and practical scripting for IT operations.",
  },
];