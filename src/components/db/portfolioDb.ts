export interface SkillItem {
  name: string;
  level: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  modalTitle: string;
  modalDescription: string;
  points: { id: string; text: string; link?: string }[];
}

export interface QualificationItem {
  id: string;
  title: string;
  subtitle: string;
  calendar: string;
}

export interface ProjectItem {
  id: string;
  image: string;
  title: string;
  category: string;
  demo?: string;
  buy?: string;
  github?: string;
}

export interface TestimonialItem {
  id: string;
  image: string;
  title: string;
  description: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  images: string[];
}

export interface BlogItem {
  id: string;
  title: string;
  content: string; // Tiptap content
  date: string;
  coverImage?: string;
  status?: "public" | "draft";
}

export interface PortfolioData {
  home: {
    name: string;
    subtitle: string;
    description: string;
    imageUrl?: string;
  };
  about: {
    description: string;
    experienceYears: string;
    completedProjects: string;
    supportAvailability: string;
    cvUrl?: string;
    imageUrl?: string;
  };
  skills: {
    frontend: SkillItem[];
    backend: SkillItem[];
  };
  services: ServiceItem[];
  qualification: {
    education: QualificationItem[];
    experience: QualificationItem[];
  };
  projects: ProjectItem[];
  testimonials: TestimonialItem[];
  memories: MemoryItem[];
  blogs?: BlogItem[];
  seo?: SeoConfig;
  resources?: ResourceItem[];
  resourceCategories?: ResourceCategoryNode[];
  terminalCommands?: TerminalCommandItem[];
}

export interface TerminalCommandItem {
  id: string;
  command: string;
  description: string;
  response: string;
  isHtml?: boolean;
}

export interface ResourceCategoryNode {
  id: string;
  name: string;
  children?: ResourceCategoryNode[];
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  categoryPath: string[]; // Node ID path e.g. ["cat-btech", "cat-cs"]
  tags: string[];
  source?: string;
  thumbnailUrl?: string;
  dateAdded: string;
}

export interface SeoRouteItem {
  id: string;
  path: string;
  title: string;
  description: string;
  changefreq?: string;
  priority?: number;
}

export interface SeoConfig {
  siteTitle: string;
  siteDescription: string;
  routes: SeoRouteItem[];
  faviconUrl?: string;
}

// Default initial data structure (empty template)
export const initialPortfolioData: PortfolioData = {
  home: {
    name: "",
    subtitle: "",
    description: "",
    imageUrl: ""
  },
  about: {
    description: "",
    experienceYears: "",
    completedProjects: "",
    supportAvailability: "",
    cvUrl: "",
    imageUrl: ""
  },
  skills: {
    frontend: [],
    backend: []
  },
  services: [],
  qualification: {
    education: [],
    experience: []
  },
  projects: [],
  testimonials: [],
  memories: [],
  blogs: [],
  seo: {
    siteTitle: "Upgrader Boy",
    siteDescription: "Tech. That Makes Trends",
    faviconUrl: "",
    routes: [
      { id: "blogs", path: "/blogs", title: "Blogs", description: "All Tech Blogs from Upgrader Boy", changefreq: "daily", priority: 0.8 },
      { id: "projects", path: "/projects", title: "Projects", description: "All Projects developed by Upgrader Boy", changefreq: "weekly", priority: 0.8 },
      { id: "memories", path: "/memories", title: "Memories", description: "Cool Memories of Upgrader Boy in his Tech Journey", changefreq: "weekly", priority: 0.6 },
      { id: "resources", path: "/resources", title: "Resources", description: "All Tech Resources by Upgrader Boy", changefreq: "weekly", priority: 0.7 }
    ]
  },
  resources: [],
  resourceCategories: [
    {
      id: "cat-btech",
      name: "B.Tech",
      children: [
        {
          id: "cat-btech-cs",
          name: "Computer Science",
          children: [
            {
              id: "cat-btech-cs-books",
              name: "Books",
              children: [
                { id: "cat-btech-cs-books-ai", name: "AI & Machine Learning" },
                { id: "cat-btech-cs-books-android", name: "Android Development" }
              ]
            },
            {
              id: "cat-btech-cs-notes",
              name: "Notes",
              children: [
                { id: "cat-btech-cs-notes-dsa", name: "Data Structures" },
                { id: "cat-btech-cs-notes-networks", name: "Computer Networks" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "cat-gate",
      name: "GATE Exam",
      children: [
        {
          id: "cat-gate-cs",
          name: "CS & IT",
          children: [
            {
              id: "cat-gate-cs-papers",
              name: "Papers",
              children: [
                { id: "cat-gate-cs-papers-2024", name: "GATE 2024" }
              ]
            }
          ]
        }
      ]
    }
  ],
  terminalCommands: [
    {
      id: "cmd-whoami",
      command: "whoami",
      description: "Display hacker bio & summary",
      response: "Name: Ankit Bhuria\nTitle: Full Stack Engineer & Cyberpunk Designer\nBio: I build responsive, animated web platforms and high-performance server backends using modern design tokens and cloud databases.\nUptime Status: Online 24/7",
      isHtml: false
    },
    {
      id: "cmd-skills",
      command: "skills",
      description: "List developer & auditor skills",
      response: "<div><strong>[Frontend Technologies]</strong><br>HTML & CSS, JavaScript / TypeScript, React / Redux / Next.js, Styled Components</div><div style=\"margin-top: 0.5rem\"><strong>[Backend & DevOps]</strong><br>Node.js / Express, Python / Django, Firebase / Firestore, SQL (PostgreSQL / MySQL)</div><div style=\"margin-top: 0.5rem\"><strong>[Security Toolkit]</strong><br>Metasploit, Nmap, Wireshark, Burp Suite, OWASP Zap, Ghidra</div>",
      isHtml: true
    },
    {
      id: "cmd-projects",
      command: "projects",
      description: "Show cases and repositories",
      response: "[SYSTEM_PROJECTS]",
      isHtml: true
    },
    {
      id: "cmd-neofetch",
      command: "neofetch",
      description: "Display hacker system details",
      response: "[SYSTEM_NEOFETCH]",
      isHtml: true
    },
    {
      id: "cmd-secret",
      command: "secret",
      description: "Decrypt hidden system node",
      response: "<div class=\"terminal__secret-granted\"><i class=\"uil uil-shield-check\" style=\"font-size: 2.5rem; color: #00ff1e; display: block; margin-bottom: 0.25rem;\"></i><div>ACCESS GRANTED</div><div class=\"terminal__fade\" style=\"font-size: 0.8rem; margin-top: 0.25rem;\">Decrypted: \"Keep upgrading, stay secure.\"</div></div>",
      isHtml: true
    }
  ]
};
