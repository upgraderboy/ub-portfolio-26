#!/usr/bin/env node

/**
 * ESM Node.js Script to Migrate Firestore Database to PostgreSQL/SQL Relational Schema.
 * Extracts data from Firestore collections and:
 *   1. Writes database inserts directly to PostgreSQL if connection credentials are provided.
 *   2. Generates a standardized 'migration_dump.sql' script file.
 * Includes a complete offline fallback using the local initial dataset.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: Escape string safely for PostgreSQL inserts
function escape(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return String(val);
  return `'${String(val).replace(/'/g, "''")}'`;
}

// Helper: Format UUID/IDs for sub-items
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Standard mock initial values fallback (matches portfolio schema)
const localInitialData = {
  home: {
    name: "Ankit Bhuria",
    subtitle: "Full Stack Engineer & Cyberpunk Designer",
    description: "I build responsive, animated web platforms and high-performance server backends using modern design tokens and cloud databases.",
    imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop"
  },
  about: {
    description: "Professional software engineer with expertise in React, Next.js, Node.js, and Google Cloud environments. Focuses on writing scalable, clean code with interactive frontends.",
    experienceYears: "5+",
    completedProjects: "45+",
    supportAvailability: "24/7",
    cvUrl: "https://example.com/cv.pdf",
    imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop"
  },
  skills: {
    frontend: [
      { name: "HTML & CSS", level: "Advanced" },
      { name: "JavaScript / TypeScript", level: "Advanced" },
      { name: "React / Redux / Next.js", level: "Advanced" },
      { name: "Styled Components", level: "Advanced" }
    ],
    backend: [
      { name: "Node.js / Express", level: "Advanced" },
      { name: "Python / Django", level: "Intermediate" },
      { name: "Firebase / Firestore", level: "Advanced" },
      { name: "SQL (PostgreSQL / MySQL)", level: "Advanced" }
    ]
  },
  services: [
    {
      id: "srv-web",
      title: "Web Development",
      icon: "uil-web-grid",
      modalTitle: "Web Platform Development",
      modalDescription: "Developing modern, blazing fast React and Next.js applications.",
      points: [
        { id: "pt-1", text: "Create responsive designs that fit all viewports." },
        { id: "pt-2", text: "Implement custom animations and micro-interactions." }
      ]
    }
  ],
  qualification: {
    education: [
      { id: "edu-1", title: "B.Tech in Computer Science", subtitle: "Tech University", calendar: "2018 - 2022" }
    ],
    experience: [
      { id: "exp-1", title: "Senior Software Engineer", subtitle: "AppCorp Solutions", calendar: "2022 - Present" }
    ]
  },
  projects: [
    {
      id: "proj-1",
      title: "Interactive Flipbook PDF Reader",
      category: "Web App",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop",
      demo: "https://example.com/flipbook",
      github: "https://github.com/upgraderboy/flipbook"
    }
  ],
  testimonials: [
    {
      id: "test-1",
      title: "Sarah Jenkins, PM at AppCorp",
      description: "Ankit delivered the project ahead of schedule. The quality of animations and performance was exceptional.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
    }
  ],
  memories: [
    {
      id: "mem-1",
      title: "Graduation Ceremony",
      description: "Received B.Tech Computer Science degree with honors.",
      category: "Academic",
      images: ["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=500&auto=format&fit=crop"]
    }
  ],
  blogs: [
    {
      id: "blog-1",
      title: "Mastering Clean Coding Patterns in React",
      content: "<h2>Introduction</h2><p>Writing clean code is essential for maintaining team velocity and reducing bug count in React ecosystems...</p>",
      coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
      status: "public",
      date: "August 3, 2026"
    }
  ],
  seo: {
    siteTitle: "Upgrader Boy Portfolio",
    siteDescription: "High-performance software engineer portfolio website.",
    faviconUrl: "/favicon.ico",
    routes: [
      { id: "blogs", path: "/blogs", title: "Blogs", description: "Read software engineering tutorials." }
    ]
  },
  resources: [
    {
      id: "res-dsa",
      title: "Data Structures & Algorithms Cheatsheet",
      description: "Essential guide containing complexity charts, sorting cheats, and tree formulas.",
      pdfUrl: "https://example.com/dsa.pdf",
      categoryPath: ["cat-btech", "cat-btech-cs", "cat-btech-cs-notes-dsa"],
      tags: ["DSA", "Cheatsheet", "StudyNotes"],
      source: "Upgrader Boy Prep Library",
      thumbnailUrl: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=200&auto=format&fit=crop",
      dateAdded: "Aug 5, 2026"
    }
  ],
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
              id: "cat-btech-cs-notes",
              name: "Notes",
              children: [
                { id: "cat-btech-cs-notes-dsa", name: "Data Structures" }
              ]
            }
          ]
        }
      ]
    }
  ]
};

async function main() {
  console.log("\x1b[35m=== Upgrader Boy Database SQL Migration Tool ===\x1b[0m\n");
  
  let useLiveFirestore = false;
  let adminSdk = null;
  let firestoreDb = null;
  
  // 1. Try connecting to Live Firestore Database
  try {
    const pkg = await import("firebase-admin");
    adminSdk = pkg.default;
    
    // Look for credentials key file
    const serviceAccountPath = path.join(process.cwd(), "service-account.json");
    if (fs.existsSync(serviceAccountPath)) {
      adminSdk.initializeApp({
        credential: adminSdk.credential.cert(serviceAccountPath)
      });
      firestoreDb = adminSdk.firestore();
      useLiveFirestore = true;
      console.log("\x1b[32m✔ Live Database Mode: Found service-account.json. Connecting to Cloud Firestore...\x1b[0m");
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      adminSdk.initializeApp();
      firestoreDb = adminSdk.firestore();
      useLiveFirestore = true;
      console.log("\x1b[32m✔ Live Database Mode: GOOGLE_APPLICATION_CREDENTIALS is set. Connecting to Cloud Firestore...\x1b[0m");
    } else {
      console.log("\x1b[33mℹ Offline Mode: No credentials found. Generating SQL dump from initial template structure.\x1b[0m");
      console.log("  To extract live Firestore database, download a private key JSON from Firebase Console,");
      console.log("  name it \x1b[36mservice-account.json\x1b[0m and place it in this workspace root.\n");
    }
  } catch (err) {
    console.log("\x1b[33mℹ Offline Mode: firebase-admin is not installed. Exporting initial template schema.\x1b[0m");
    console.log("  Install firebase-admin to connect to a live Firebase project: \x1b[36mnpm install -D firebase-admin\x1b[0m\n");
  }

  let data = localInitialData;
  let commentsList = [];
  let likesList = [];
  let newsletterList = [];
  let usersList = [
    { id: "mock-user-1", name: "Ankit Bhuria", email: "ankit@example.com", role: "admin" }
  ];

  if (useLiveFirestore && firestoreDb) {
    try {
      console.log("Reading data collections from Firestore...");
      
      // Read core portfolio_config configuration
      const configSnap = await firestoreDb.collection("portfolio_config").doc("data").get();
      if (configSnap.exists) {
        data = configSnap.data();
        console.log("  - Loaded configurations doc");
      }

      // Read supplementary flat collections
      const projectsSnap = await firestoreDb.collection("projects").get();
      if (!projectsSnap.empty) {
        data.projects = [];
        projectsSnap.forEach(doc => data.projects.push({ ...doc.data(), id: doc.id }));
        console.log(`  - Loaded projects (${data.projects.length} documents)`);
      }

      const memoriesSnap = await firestoreDb.collection("memories").get();
      if (!memoriesSnap.empty) {
        data.memories = [];
        memoriesSnap.forEach(doc => data.memories.push({ ...doc.data(), id: doc.id }));
        console.log(`  - Loaded memories (${data.memories.length} documents)`);
      }

      const blogsSnap = await firestoreDb.collection("blogs").get();
      if (!blogsSnap.empty) {
        data.blogs = [];
        blogsSnap.forEach(doc => data.blogs.push({ ...doc.data(), id: doc.id }));
        console.log(`  - Loaded blogs (${data.blogs.length} documents)`);
      }

      // Read relational comments
      const commentsSnap = await firestoreDb.collectionGroup("comments").get();
      if (!commentsSnap.empty) {
        commentsSnap.forEach(doc => {
          const parentPath = doc.ref.parent.parent.path; // e.g. blogs/blog-1
          const blogId = parentPath.split("/")[1];
          commentsList.push({ ...doc.data(), id: doc.id, blogId });
        });
        console.log(`  - Loaded comments (${commentsList.length} items)`);
      }

      // Read relational likes
      const likesSnap = await firestoreDb.collectionGroup("likes").get();
      if (!likesSnap.empty) {
        likesSnap.forEach(doc => {
          const parentPath = doc.ref.parent.parent.path;
          const blogId = parentPath.split("/")[1];
          likesList.push({ ...doc.data(), id: doc.id, blogId });
        });
        console.log(`  - Loaded likes (${likesList.length} items)`);
      }

      // Read newsletter subscribers
      const newsletterSnap = await firestoreDb.collection("newsletter").get();
      if (!newsletterSnap.empty) {
        newsletterSnap.forEach(doc => newsletterList.push({ ...doc.data(), id: doc.id }));
        console.log(`  - Loaded newsletter list (${newsletterList.length} emails)`);
      }

      // Read terminal commands collection
      const terminalSnap = await firestoreDb.collection("terminal_commands").get();
      if (!terminalSnap.empty) {
        data.terminalCommands = [];
        terminalSnap.forEach(doc => data.terminalCommands.push({ ...doc.data(), id: doc.id }));
        console.log(`  - Loaded terminal commands (${data.terminalCommands.length} documents)`);
      }

      // Read users list
      const usersSnap = await firestoreDb.collection("users").get();
      if (!usersSnap.empty) {
        usersList = [];
        usersSnap.forEach(doc => usersList.push({ ...doc.data(), id: doc.id }));
        console.log(`  - Loaded users (${usersList.length} accounts)`);
      }

    } catch (readError) {
      console.error("\x1b[31mFailed to read from Cloud Firestore database collections. Using local fallbacks.\x1b[0m", readError);
    }
  }

  // Generate relational SQL insert commands
  let sql = [];
  sql.push("-- ==========================================================================");
  sql.push("-- Upgrader Boy Relational Database Migration Dump Script");
  sql.push(`-- Generated At: ${new Date().toISOString()}`);
  sql.push("-- Target SQL Dialect: PostgreSQL / standard ANSI SQL");
  sql.push("-- ==========================================================================\n");

  sql.push("BEGIN;\n");

  // Helper arrays for statement-by-statement live execution
  const activeStatements = [];

  const addStatement = (stmt) => {
    sql.push(stmt);
    activeStatements.push(stmt);
  };

  // 1. Users insertion
  addStatement("-- 1. Users insertion");
  usersList.forEach(u => {
    addStatement(`INSERT INTO users (id, name, email, role) VALUES (${escape(u.id)}, ${escape(u.name || "User")}, ${escape(u.email)}, ${escape(u.role || "user")}) ON CONFLICT (id) DO NOTHING;`);
  });
  sql.push("");

  // 2. Home & About configs insertion
  addStatement("-- 2. Config singletons insertion");
  if (data.home) {
    addStatement(`INSERT INTO portfolio_home (id, name, subtitle, description, image_url) VALUES ('data', ${escape(data.home.name)}, ${escape(data.home.subtitle)}, ${escape(data.home.description)}, ${escape(data.home.imageUrl)}) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description, image_url = EXCLUDED.image_url;`);
  }
  if (data.about) {
    addStatement(`INSERT INTO portfolio_about (id, description, experience_years, completed_projects, support_availability, cv_url, image_url) VALUES ('data', ${escape(data.about.description)}, ${escape(data.about.experienceYears)}, ${escape(data.about.completedProjects)}, ${escape(data.about.supportAvailability)}, ${escape(data.about.cvUrl)}, ${escape(data.about.imageUrl)}) ON CONFLICT (id) DO UPDATE SET description = EXCLUDED.description, experience_years = EXCLUDED.experience_years, completed_projects = EXCLUDED.completed_projects, support_availability = EXCLUDED.support_availability, cv_url = EXCLUDED.cv_url, image_url = EXCLUDED.image_url;`);
  }
  sql.push("");

  // 3. Skills insertion
  addStatement("-- 3. Skills list insertion");
  if (data.skills) {
    if (Array.isArray(data.skills.frontend)) {
      data.skills.frontend.forEach(s => {
        addStatement(`INSERT INTO skills (name, level, category) VALUES (${escape(s.name)}, ${escape(s.level)}, 'frontend');`);
      });
    }
    if (Array.isArray(data.skills.backend)) {
      data.skills.backend.forEach(s => {
        addStatement(`INSERT INTO skills (name, level, category) VALUES (${escape(s.name)}, ${escape(s.level)}, 'backend');`);
      });
    }
  }
  sql.push("");

  // 4. Services & Service Points insertion
  addStatement("-- 4. Services & Service Points insertion");
  if (Array.isArray(data.services)) {
    data.services.forEach(srv => {
      addStatement(`INSERT INTO services (id, title, icon, modal_title, modal_description) VALUES (${escape(srv.id)}, ${escape(srv.title)}, ${escape(srv.icon)}, ${escape(srv.modalTitle)}, ${escape(srv.modalDescription)}) ON CONFLICT (id) DO NOTHING;`);
      if (Array.isArray(srv.points)) {
        srv.points.forEach(pt => {
          addStatement(`INSERT INTO service_points (id, service_id, text, link) VALUES (${escape(pt.id || generateId())}, ${escape(srv.id)}, ${escape(pt.text)}, ${escape(pt.link || null)}) ON CONFLICT (id) DO NOTHING;`);
        });
      }
    });
  }
  sql.push("");

  // 5. Qualifications insertion
  addStatement("-- 5. Qualifications list insertion");
  if (data.qualification) {
    if (Array.isArray(data.qualification.education)) {
      data.qualification.education.forEach(edu => {
        addStatement(`INSERT INTO qualifications (id, title, subtitle, calendar, type) VALUES (${escape(edu.id || generateId())}, ${escape(edu.title)}, ${escape(edu.subtitle)}, ${escape(edu.calendar)}, 'education') ON CONFLICT (id) DO NOTHING;`);
      });
    }
    if (Array.isArray(data.qualification.experience)) {
      data.qualification.experience.forEach(exp => {
        addStatement(`INSERT INTO qualifications (id, title, subtitle, calendar, type) VALUES (${escape(exp.id || generateId())}, ${escape(exp.title)}, ${escape(exp.subtitle)}, ${escape(exp.calendar)}, 'experience') ON CONFLICT (id) DO NOTHING;`);
      });
    }
  }
  sql.push("");

  // 6. Projects insertion
  addStatement("-- 6. Projects list insertion");
  if (Array.isArray(data.projects)) {
    data.projects.forEach(p => {
      addStatement(`INSERT INTO projects (id, title, category, image_url, demo_url, buy_url, github_url) VALUES (${escape(p.id)}, ${escape(p.title)}, ${escape(p.category)}, ${escape(p.image)}, ${escape(p.demo || null)}, ${escape(p.buy || null)}, ${escape(p.github || null)}) ON CONFLICT (id) DO NOTHING;`);
    });
  }
  sql.push("");

  // 7. Testimonials insertion
  addStatement("-- 7. Testimonials list insertion");
  if (Array.isArray(data.testimonials)) {
    data.testimonials.forEach(t => {
      addStatement(`INSERT INTO testimonials (id, title, description, image_url) VALUES (${escape(t.id)}, ${escape(t.title)}, ${escape(t.description)}, ${escape(t.image)}) ON CONFLICT (id) DO NOTHING;`);
    });
  }
  sql.push("");

  // 8. Memories & Memory Images insertion
  addStatement("-- 8. Memories & Memory Images insertion");
  if (Array.isArray(data.memories)) {
    data.memories.forEach(mem => {
      addStatement(`INSERT INTO memories (id, title, description, category, date_label) VALUES (${escape(mem.id)}, ${escape(mem.title)}, ${escape(mem.description)}, ${escape(mem.category)}, ${escape(mem.date)}) ON CONFLICT (id) DO NOTHING;`);
      if (Array.isArray(mem.images)) {
        mem.images.forEach(img => {
          addStatement(`INSERT INTO memory_images (memory_id, image_url) VALUES (${escape(mem.id)}, ${escape(img)});`);
        });
      }
    });
  }
  sql.push("");

  // 9. Blogs insertion
  addStatement("-- 9. Blogs list insertion");
  if (Array.isArray(data.blogs)) {
    data.blogs.forEach(b => {
      addStatement(`INSERT INTO blogs (id, title, content, cover_image, status, published_date) VALUES (${escape(b.id)}, ${escape(b.title)}, ${escape(b.content)}, ${escape(b.coverImage || null)}, ${escape(b.status || "public")}, ${escape(b.date || null)}) ON CONFLICT (id) DO NOTHING;`);
    });
  }
  sql.push("");

  // 10. Blog Likes insertion
  addStatement("-- 10. Blog Likes insertion");
  likesList.forEach(like => {
    const userId = like.userId || (usersList[0] ? usersList[0].id : null);
    if (userId) {
      addStatement(`INSERT INTO blog_likes (id, blog_id, user_id) VALUES (${escape(like.id)}, ${escape(like.blogId)}, ${escape(userId)}) ON CONFLICT (id) DO NOTHING;`);
    }
  });
  sql.push("");

  // 11. Blog Comments insertion (Top level comments first to avoid parent constraints)
  addStatement("-- 11. Blog Comments insertion");
  const topComments = commentsList.filter(c => !c.parentCommentId);
  const replies = commentsList.filter(c => c.parentCommentId);

  topComments.forEach(c => {
    const userId = c.userId || null;
    addStatement(`INSERT INTO blog_comments (id, blog_id, user_id, user_name, user_avatar, content, parent_comment_id) VALUES (${escape(c.id)}, ${escape(c.blogId)}, ${escape(userId)}, ${escape(c.userName || "Guest")}, ${escape(c.userAvatar || null)}, ${escape(c.content)}, NULL) ON CONFLICT (id) DO NOTHING;`);
  });

  replies.forEach(c => {
    const userId = c.userId || null;
    addStatement(`INSERT INTO blog_comments (id, blog_id, user_id, user_name, user_avatar, content, parent_comment_id) VALUES (${escape(c.id)}, ${escape(c.blogId)}, ${escape(userId)}, ${escape(c.userName || "Guest")}, ${escape(c.userAvatar || null)}, ${escape(c.content)}, ${escape(c.parentCommentId)}) ON CONFLICT (id) DO NOTHING;`);
  });
  sql.push("");

  // 12. SEO Config & Routes insertion
  addStatement("-- 12. SEO Configuration insertion");
  if (data.seo) {
    addStatement(`INSERT INTO seo_config (id, site_title, site_description, favicon_url) VALUES ('data', ${escape(data.seo.siteTitle)}, ${escape(data.seo.siteDescription)}, ${escape(data.seo.faviconUrl)}) ON CONFLICT (id) DO UPDATE SET site_title = EXCLUDED.site_title, site_description = EXCLUDED.site_description, favicon_url = EXCLUDED.favicon_url;`);
    if (Array.isArray(data.seo.routes)) {
      data.seo.routes.forEach(r => {
        addStatement(`INSERT INTO seo_routes (id, path, title, description, changefreq, priority) VALUES (${escape(r.id)}, ${escape(r.path)}, ${escape(r.title)}, ${escape(r.description)}, ${escape(r.changefreq || 'weekly')}, ${escape(r.priority || 0.50)}) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, changefreq = EXCLUDED.changefreq, priority = EXCLUDED.priority;`);
      });
    }
  }
  sql.push("");

  // 13. Resource Categories hierarchy insertion
  addStatement("-- 13. Resource Categories hierarchy insertion");
  function insertCategoryNode(node, parentId = null) {
    addStatement(`INSERT INTO resource_categories (id, name, parent_id) VALUES (${escape(node.id)}, ${escape(node.name)}, ${escape(parentId)}) ON CONFLICT (id) DO NOTHING;`);
    if (Array.isArray(node.children)) {
      node.children.forEach(child => insertCategoryNode(child, node.id));
    }
  }
  if (Array.isArray(data.resourceCategories)) {
    data.resourceCategories.forEach(rootCat => insertCategoryNode(rootCat, null));
  }
  sql.push("");

  // 14. Resources, tags, and category mappings
  addStatement("-- 14. Resources, tags, and category mappings");
  if (Array.isArray(data.resources)) {
    data.resources.forEach(r => {
      addStatement(`INSERT INTO resources (id, title, description, pdf_url, thumbnail_url, source, date_added) VALUES (${escape(r.id)}, ${escape(r.title)}, ${escape(r.description)}, ${escape(r.pdfUrl)}, ${escape(r.thumbnailUrl || null)}, ${escape(r.source || null)}, ${escape(r.dateAdded)}) ON CONFLICT (id) DO NOTHING;`);
      
      if (Array.isArray(r.categoryPath)) {
        r.categoryPath.forEach(catId => {
          addStatement(`INSERT INTO resource_category_mapping (resource_id, category_id) VALUES (${escape(r.id)}, ${escape(catId)});`);
        });
      }

      if (Array.isArray(r.tags)) {
        r.tags.forEach(tag => {
          addStatement(`INSERT INTO resource_tags (resource_id, tag) VALUES (${escape(r.id)}, ${escape(tag)});`);
        });
      }
    });
  }
  sql.push("");

  // 15. Newsletter Subscribers list
  addStatement("-- 15. Newsletter Subscribers list");
  newsletterList.forEach(sub => {
    addStatement(`INSERT INTO newsletter_subscribers (email) VALUES (${escape(sub.email)}) ON CONFLICT (email) DO NOTHING;`);
  });
  sql.push("");

  // 16. Terminal Commands list
  addStatement("-- 16. Terminal Commands list");
  if (Array.isArray(data.terminalCommands)) {
    data.terminalCommands.forEach(cmd => {
      addStatement(`INSERT INTO terminal_commands (id, command, description, response, is_html) VALUES (${escape(cmd.id)}, ${escape(cmd.command)}, ${escape(cmd.description)}, ${escape(cmd.response)}, ${escape(cmd.isHtml || false)}) ON CONFLICT (command) DO UPDATE SET description = EXCLUDED.description, response = EXCLUDED.response, is_html = EXCLUDED.is_html;`);
    });
  }
  sql.push("");

  sql.push("COMMIT;\n");

  // 16. Exporter: Save generated SQL file
  const dumpPath = path.join(process.cwd(), "migration_dump.sql");
  fs.writeFileSync(dumpPath, sql.join("\n"), "utf8");
  console.log(`\x1b[32m✔ Exported output SQL dump file saved to: \x1b[36m${dumpPath}\x1b[0m`);

  // 17. Live Mode: Try connecting and executing directly on PostgreSQL if credentials are provided
  const pgCredentials = {
    host: process.env.PGHOST || process.env.PG_HOST,
    user: process.env.PGUSER || process.env.PG_USER,
    password: process.env.PGPASSWORD || process.env.PG_PASSWORD,
    database: process.env.PGDATABASE || process.env.PG_DATABASE,
    port: process.env.PGPORT || process.env.PG_PORT || 5432,
    connectionString: process.env.DATABASE_URL
  };
  
  const hasPgCredentials = pgCredentials.connectionString || (pgCredentials.host && pgCredentials.database);

  if (hasPgCredentials) {
    console.log("\nConnecting to live PostgreSQL database to perform migration...");
    try {
      const pgPkg = await import("pg");
      const Client = pgPkg.default.Client;
      
      const client = new Client(pgCredentials.connectionString ? { connectionString: pgCredentials.connectionString } : pgCredentials);
      await client.connect();
      console.log("\x1b[32m✔ Connected to PostgreSQL database successfully.\x1b[0m");

      // Check and execute schema.sql DDL setup
      const schemaSqlPath = path.join(__dirname, "schema.sql");
      if (fs.existsSync(schemaSqlPath)) {
        console.log("Executing schema.sql DDL table setup...");
        const schemaSql = fs.readFileSync(schemaSqlPath, "utf8");
        await client.query(schemaSql);
        console.log("  - DDL tables construction complete");
      }

      // Execute SQL Transaction Statements
      console.log("Inserting migration records into live PostgreSQL tables...");
      await client.query("BEGIN;");
      for (const statement of activeStatements) {
        const stmtTrim = statement.trim();
        if (stmtTrim && !stmtTrim.startsWith("--")) {
          await client.query(stmtTrim);
        }
      }
      await client.query("COMMIT;");
      console.log("\x1b[32m✔ Live database migration completed successfully!\x1b[0m");
      
      await client.end();
    } catch (pgError) {
      console.error("\x1b[31m✖ Live PostgreSQL Migration Failed:\x1b[0m", pgError.message);
      console.log("Ensure the 'pg' library is installed (\x1b[36mnpm install -D pg\x1b[0m) and database credentials are correct.");
    }
  } else {
    console.log("\nTo import this dump into your PostgreSQL database:");
    console.log("  1. Create tables first: \x1b[34mpsql -U username -d dbname -f src/components/db/schema.sql\x1b[0m");
    console.log("  2. Load migrated values: \x1b[34mpsql -U username -d dbname -f migration_dump.sql\x1b[0m\n");
    console.log("  Alternatively, set standard env credentials (e.g. PGHOST, PGUSER, PGPASSWORD, PGDATABASE) to perform live inserts automatically!");
  }
}

main().catch(err => {
  console.error("Critical Migration Error:", err);
  process.exit(1);
});
