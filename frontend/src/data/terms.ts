export type Term = {
  id: number;
  term: string;
  tags: string[];
  description: string;
  definition: string;
};

export const terms: Term[] = [
  {
    id: 1,
    term: "DHCP",
    tags: ["network", "windows-server"],
    description: "Automatically gives devices IP configuration.",
    definition:
      "Dynamic Host Configuration Protocol is used to automatically assign IP addresses, subnet masks, default gateways and DNS servers to network clients.",
  },
  {
    id: 2,
    term: "DNS",
    tags: ["network", "windows-server", "linux"],
    description: "Translates names into IP addresses.",
    definition:
      "Domain Name System is the service that translates human-readable names like studyhub.local into IP addresses that computers can use.",
  },
  {
    id: 3,
    term: "Active Directory",
    tags: ["windows-server"],
    description: "Centralized identity and resource management.",
    definition:
      "Active Directory is Microsoft's directory service for managing users, computers, groups and policies in a Windows domain environment.",
  },
  {
    id: 4,
    term: "Group Policy",
    tags: ["windows-server", "security"],
    description: "Centralized configuration for users and computers.",
    definition:
      "Group Policy allows administrators to centrally configure settings, security rules, scripts and restrictions for users and computers in an Active Directory domain.",
  },
  {
    id: 5,
    term: "chmod",
    tags: ["linux", "security"],
    description: "Changes file permissions in Linux.",
    definition:
      "chmod is a Linux command used to change file and directory permissions, such as read, write and execute access for owner, group and others.",
  },
  {
    id: 6,
    term: "SSH",
    tags: ["linux", "network", "security"],
    description: "Secure remote command-line access.",
    definition:
      "Secure Shell is a protocol used to securely connect to remote systems over a network, usually for command-line administration.",
  },
  {
    id: 7,
    term: "Subnet Mask",
    tags: ["network"],
    description: "Defines which part of an IP address is the network portion.",
    definition:
      "A subnet mask separates the network part and host part of an IP address. It helps devices determine whether another device is on the same local network.",
  },
  {
    id: 8,
    term: "Firewall",
    tags: ["network", "security", "windows-server", "linux"],
    description: "Controls allowed and blocked network traffic.",
    definition:
      "A firewall filters network traffic based on rules. It can allow, block or log traffic depending on source, destination, port, protocol and application.",
  },
  {
    id: 9,
    term: "SQL",
    tags: ["databases"],
    description: "Language used to work with relational databases.",
    definition:
      "Structured Query Language is used to create, read, update and delete data in relational database systems.",
  },
  {
    id: 10,
    term: "Primary Key",
    tags: ["databases"],
    description: "Uniquely identifies a row in a table.",
    definition:
      "A primary key is a column, or combination of columns, that uniquely identifies each row in a database table.",
  },
  {
    id: 11,
    term: "Hypervisor",
    tags: ["virtualization"],
    description: "Software layer that runs virtual machines.",
    definition:
      "A hypervisor is software or firmware that creates and manages virtual machines by sharing physical hardware resources between them.",
  },
  {
    id: 12,
    term: "PowerShell",
    tags: ["scripting", "windows-server"],
    description: "Command shell and scripting language from Microsoft.",
    definition:
      "PowerShell is a command-line shell and scripting language used for automation, configuration and administration, especially in Windows environments.",
  },
];