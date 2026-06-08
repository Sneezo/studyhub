export type ClassFilter = "All" | "SN" | "DS";

export type Subject = {
  id: string;
  name: string;
  classes: Array<"SN" | "DS">;
  description: string;
};

export const subjects: Subject[] = [
  {
    id: "windows-client",
    name: "Windows Client",
    classes: ["DS"],
    description:
      "Windows client installation, configuration and troubleshooting.",
  },
  {
    id: "hardware",
    name: "Hardware",
    classes: ["DS"],
    description: "Computer components, troubleshooting and hardware concepts.",
  },
  {
    id: "ds-server",
    name: "DS Server",
    classes: ["DS"],
    description: "Server topics for the DS class.",
  },
  {
    id: "network-fundamentals",
    name: "Network Fundamentals",
    classes: ["DS"],
    description:
      "Networking fundamentals, IP addressing, routing, switching and troubleshooting.",
  },
  {
    id: "linux",
    name: "Linux",
    classes: ["DS"],
    description:
      "Linux command line, users, permissions, services and server administration.",
  },
  {
    id: "it-security",
    name: "IT Security",
    classes: ["DS"],
    description:
      "Cybersecurity, attacks, defense, encryption, hardening and incident response.",
  },

  {
    id: "azure",
    name: "Azure",
    classes: ["SN"],
    description: "Microsoft Azure cloud services and administration.",
  },
  {
    id: "sn-server",
    name: "SN Server",
    classes: ["SN"],
    description:
      "Windows Server, Active Directory, DNS, DHCP, Hyper-V and server administration.",
  },
  {
    id: "datacenter",
    name: "Datacenter",
    classes: ["SN"],
    description:
      "Datacenter infrastructure, storage, virtualization and availability.",
  },
  {
    id: "cisco",
    name: "Cisco",
    classes: ["SN"],
    description: "Cisco networking, switching, routing and device configuration.",
  },
  {
    id: "itil",
    name: "ITIL",
    classes: ["SN"],
    description: "IT service management concepts and processes.",
  },
  {
    id: "ms365",
    name: "MS365",
    classes: ["SN"],
    description: "Microsoft 365 services, administration and identity.",
  },
  {
    id: "database",
    name: "Database",
    classes: ["SN"],
    description: "Database design, SQL and relational database concepts.",
  },
];