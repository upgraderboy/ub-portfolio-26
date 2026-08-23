#!/usr/bin/env node

/**
 * ES Module Migration Script using Neon Serverless WebSocket Client.
 * Bypasses TCP port 5432 blocks by routing queries over standard WebSocket (port 443).
 * Retains standard pg-compatible client interface and transaction support.
 */

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Client } from "@neondatabase/serverless";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";

// Load environment variables
dotenv.config();

// Neon Connection URI
const PG_CONNECTION_STRING = "postgresql://ub_owner:WPv8JTzcXLO6@ep-lingering-river-a536f44l-pooler.us-east-2.aws.neon.tech/upgraderboy-portfolio?sslmode=require&channel_binding=require";

// Firebase Config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "ub-portfolio",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Helper: Escape string safely for PostgreSQL
function escape(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return String(val);
  return `'${String(val).replace(/'/g, "''")}'`;
}

// Helper: Generate a unique ID if missing
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

async function runMigration() {
  console.log("\x1b[35m=== Upgrader Boy Live Firestore to Neon PostgreSQL (WebSocket Mode) ===\x1b[0m\n");

  if (!firebaseConfig.apiKey) {
    console.error("\x1b[31mError: VITE_FIREBASE_API_KEY is not defined in your .env file.\x1b[0m");
    process.exit(1);
  }

  // 1. Initialize Firebase client SDK
  console.log("Initializing client-side Firebase app...");
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  console.log("✔ Firebase initialized successfully.");

  // 2. Fetch Core Config Doc
  console.log("Fetching core portfolio config doc...");
  let coreConfig = null;
  try {
    const docRef = doc(db, "portfolio_config", "data");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      coreConfig = snap.data();
      console.log("✔ Retrieved portfolio_config/data");
    } else {
      console.log("ℹ Config document does not exist in Firestore. Using default mock configuration fallbacks.");
    }
  } catch (err) {
    console.warn("⚠ Failed to retrieve core configurations doc:", err.message);
  }

  // Helper fetch collection
  async function fetchCollection(name) {
    try {
      const snap = await getDocs(collection(db, name));
      const list = [];
      snap.forEach(doc => list.push({ ...doc.data(), id: doc.id }));
      console.log(`✔ Fetched collection "${name}" (${list.length} documents)`);
      return list;
    } catch (err) {
      console.warn(`⚠ Failed to fetch collection "${name}":`, err.message);
      return [];
    }
  }

  // 3. Fetch flat collections with fallback to core config document arrays
  let projects = (coreConfig && coreConfig.projects) || [];
  if (projects.length === 0) {
    projects = await fetchCollection("projects");
  } else {
    console.log(`✔ Loaded projects from core config (${projects.length} documents)`);
  }

  let memories = (coreConfig && coreConfig.memories) || [];
  if (memories.length === 0) {
    memories = await fetchCollection("memories");
  } else {
    console.log(`✔ Loaded memories from core config (${memories.length} documents)`);
  }

  let blogs = (coreConfig && coreConfig.blogs) || [];
  if (blogs.length === 0) {
    blogs = await fetchCollection("blogs");
  } else {
    console.log(`✔ Loaded blogs from core config (${blogs.length} documents)`);
  }

  let resources = (coreConfig && coreConfig.resources) || [];
  if (resources.length === 0) {
    resources = await fetchCollection("resources");
  } else {
    console.log(`✔ Loaded resources from core config (${resources.length} documents)`);
  }

  let terminalCommands = (coreConfig && coreConfig.terminalCommands) || [];
  if (terminalCommands.length === 0) {
    terminalCommands = await fetchCollection("terminal_commands");
  } else {
    console.log(`✔ Loaded terminal_commands from core config (${terminalCommands.length} documents)`);
  }

  // Read relational subcollections (comments & likes)
  const commentsList = [];
  const likesList = [];
  const newsletterList = [];

  // Parse comments and likes if blogs exist
  if (blogs.length > 0) {
    for (const b of blogs) {
      try {
        const commentsSnap = await getDocs(collection(db, `blogs/${b.id}/comments`));
        commentsSnap.forEach(doc => {
          commentsList.push({ ...doc.data(), id: doc.id, blogId: b.id });
        });
        const likesSnap = await getDocs(collection(db, `blogs/${b.id}/likes`));
        likesSnap.forEach(doc => {
          likesList.push({ ...doc.data(), id: doc.id, blogId: b.id });
        });
      } catch (err) {
        // Silently skip if subcollection not found
      }
    }
    console.log(`✔ Fetched blog comments (${commentsList.length} total)`);
    console.log(`✔ Fetched blog likes (${likesList.length} total)`);
  }

  // Fetch newsletter subscribers
  try {
    const subSnap = await getDocs(collection(db, "newsletter"));
    subSnap.forEach(doc => {
      newsletterList.push({ ...doc.data(), id: doc.id });
    });
    console.log(`✔ Fetched newsletter subscribers (${newsletterList.length} records)`);
  } catch (err) {
    // Ignore
  }

  // 4. Connect to Neon Postgres database via WebSocket (Port 443)
  console.log("\nConnecting to Neon PostgreSQL database via WebSockets...");
  const client = new Client({ connectionString: PG_CONNECTION_STRING });
  await client.connect();
  console.log("✔ Connected to PostgreSQL database over WebSockets.");

  // 5. Build DDL tables from schema.sql
  console.log("Setting up database DDL tables using schema.sql...");
  const schemaPath = path.join(process.cwd(), "src", "components/db", "schema.sql");
  if (!fs.existsSync(schemaPath)) {
    console.error("schema.sql not found at path:", schemaPath);
    await client.end();
    process.exit(1);
  }
  const schemaSql = fs.readFileSync(schemaPath, "utf8");
  await client.query(schemaSql);
  console.log("✔ DDL table structures verified and built.");

  // 6. SQL INSERT Statements Compilation
  console.log("Uploading records to PostgreSQL...");
  await client.query("BEGIN;");

  try {
    // Clean tables first to avoid unique constraint conflicts
    await client.query("TRUNCATE TABLE blog_likes, blog_comments, blog_tags, blogs, memory_images, memories, testimonials, projects, qualifications, service_points, services, skills, portfolio_about, portfolio_home, seo_routes, seo_config, resource_tags, resource_category_mapping, resources, resource_categories, newsletter_subscribers, terminal_commands, users CASCADE;");

    // Default admin mock user
    const usersMap = new Map();
    usersMap.set("mock-user-1", { id: "mock-user-1", name: "Ankit Bhuria", email: "ankit@example.com", role: "admin" });

    // Collect all unique users from comments and likes to satisfy foreign key constraints
    for (const c of commentsList) {
      const uId = c.userId || "guest-user";
      if (!usersMap.has(uId)) {
        usersMap.set(uId, {
          id: uId,
          name: c.userName || "Guest",
          email: `${uId}@temporary.com`,
          role: "user"
        });
      }
    }
    for (const l of likesList) {
      const uId = l.userId || "guest-user";
      if (!usersMap.has(uId)) {
        usersMap.set(uId, {
          id: uId,
          name: "Liker User",
          email: `${uId}@temporary.com`,
          role: "user"
        });
      }
    }

    // Insert Users
    for (const u of usersMap.values()) {
      await client.query(`INSERT INTO users (id, name, email, role) VALUES (${escape(u.id)}, ${escape(u.name)}, ${escape(u.email)}, ${escape(u.role)}) ON CONFLICT (id) DO NOTHING;`);
    }

    // Home
    if (coreConfig?.home) {
      const h = coreConfig.home;
      await client.query(`INSERT INTO portfolio_home (id, name, subtitle, description, image_url) VALUES ('data', ${escape(h.name)}, ${escape(h.subtitle)}, ${escape(h.description)}, ${escape(h.imageUrl)}) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description, image_url = EXCLUDED.image_url;`);
    }

    // About
    if (coreConfig?.about) {
      const ab = coreConfig.about;
      await client.query(`INSERT INTO portfolio_about (id, description, experience_years, completed_projects, support_availability, cv_url, image_url) VALUES ('data', ${escape(ab.description)}, ${escape(ab.experienceYears)}, ${escape(ab.completedProjects)}, ${escape(ab.supportAvailability)}, ${escape(ab.cvUrl)}, ${escape(ab.imageUrl)}) ON CONFLICT (id) DO UPDATE SET description = EXCLUDED.description, experience_years = EXCLUDED.experience_years, completed_projects = EXCLUDED.completed_projects, support_availability = EXCLUDED.support_availability, cv_url = EXCLUDED.cv_url, image_url = EXCLUDED.image_url;`);
    }

    // Skills
    if (coreConfig?.skills) {
      if (Array.isArray(coreConfig.skills.frontend)) {
        for (const s of coreConfig.skills.frontend) {
          await client.query(`INSERT INTO skills (name, level, category) VALUES (${escape(s.name)}, ${escape(s.level)}, 'frontend');`);
        }
      }
      if (Array.isArray(coreConfig.skills.backend)) {
        for (const s of coreConfig.skills.backend) {
          await client.query(`INSERT INTO skills (name, level, category) VALUES (${escape(s.name)}, ${escape(s.level)}, 'backend');`);
        }
      }
    }

    // Services & service_points
    if (Array.isArray(coreConfig?.services)) {
      for (const s of coreConfig.services) {
        await client.query(`INSERT INTO services (id, title, icon, modal_title, modal_description) VALUES (${escape(s.id)}, ${escape(s.title)}, ${escape(s.icon)}, ${escape(s.modalTitle)}, ${escape(s.modalDescription)}) ON CONFLICT (id) DO NOTHING;`);
        if (Array.isArray(s.points)) {
          for (const pt of s.points) {
            await client.query(`INSERT INTO service_points (id, service_id, text, link) VALUES (${escape(pt.id || generateId())}, ${escape(s.id)}, ${escape(pt.text)}, ${escape(pt.link || null)}) ON CONFLICT (id) DO NOTHING;`);
          }
        }
      }
    }

    // Qualifications
    if (coreConfig?.qualification) {
      if (Array.isArray(coreConfig.qualification.education)) {
        for (const q of coreConfig.qualification.education) {
          await client.query(`INSERT INTO qualifications (id, title, subtitle, calendar, type) VALUES (${escape(q.id || generateId())}, ${escape(q.title)}, ${escape(q.subtitle)}, ${escape(q.calendar)}, 'education') ON CONFLICT (id) DO NOTHING;`);
        }
      }
      if (Array.isArray(coreConfig.qualification.experience)) {
        for (const q of coreConfig.qualification.experience) {
          await client.query(`INSERT INTO qualifications (id, title, subtitle, calendar, type) VALUES (${escape(q.id || generateId())}, ${escape(q.title)}, ${escape(q.subtitle)}, ${escape(q.calendar)}, 'experience') ON CONFLICT (id) DO NOTHING;`);
        }
      }
    }

    // Projects
    for (const p of projects) {
      await client.query(`INSERT INTO projects (id, title, category, image_url, demo_url, buy_url, github_url) VALUES (${escape(p.id)}, ${escape(p.title)}, ${escape(p.category)}, ${escape(p.image)}, ${escape(p.demo || null)}, ${escape(p.buy || null)}, ${escape(p.github || null)}) ON CONFLICT (id) DO NOTHING;`);
    }

    // Testimonials
    if (Array.isArray(coreConfig?.testimonials)) {
      for (const t of coreConfig.testimonials) {
        await client.query(`INSERT INTO testimonials (id, title, description, image_url) VALUES (${escape(t.id)}, ${escape(t.title)}, ${escape(t.description)}, ${escape(t.image)}) ON CONFLICT (id) DO NOTHING;`);
      }
    }

    // Memories & memory_images
    for (const m of memories) {
      await client.query(`INSERT INTO memories (id, title, description, category, date_label) VALUES (${escape(m.id)}, ${escape(m.title)}, ${escape(m.description)}, ${escape(m.category)}, ${escape(m.date || m.dateLabel || null)}) ON CONFLICT (id) DO NOTHING;`);
      if (Array.isArray(m.images)) {
        for (const img of m.images) {
          await client.query(`INSERT INTO memory_images (memory_id, image_url) VALUES (${escape(m.id)}, ${escape(img)});`);
        }
      }
    }

    // Blogs
    for (const b of blogs) {
      await client.query(`INSERT INTO blogs (id, title, content, cover_image, status, published_date) VALUES (${escape(b.id)}, ${escape(b.title)}, ${escape(b.content)}, ${escape(b.coverImage || null)}, ${escape(b.status || 'public')}, ${escape(b.date || b.publishedDate || null)}) ON CONFLICT (id) DO NOTHING;`);
      if (Array.isArray(b.tags)) {
        for (const t of b.tags) {
          await client.query(`INSERT INTO blog_tags (blog_id, tag) VALUES (${escape(b.id)}, ${escape(t)});`);
        }
      }
    }

    // Comments
    for (const c of commentsList) {
      await client.query(`INSERT INTO blog_comments (id, blog_id, user_id, user_name, user_avatar, content, parent_comment_id) VALUES (${escape(c.id)}, ${escape(c.blogId)}, ${escape(c.userId || 'guest-user')}, ${escape(c.userName || 'Guest')}, ${escape(c.userPhoto || c.userAvatar || null)}, ${escape(c.text || c.content)}, ${escape(c.parentId || c.parentCommentId || null)}) ON CONFLICT (id) DO NOTHING;`);
    }

    // Likes
    for (const l of likesList) {
      await client.query(`INSERT INTO blog_likes (id, blog_id, user_id) VALUES (${escape(l.id)}, ${escape(l.blogId)}, ${escape(l.userId || 'guest-user')}) ON CONFLICT (id) DO NOTHING;`);
    }

    // Newsletter
    for (const n of newsletterList) {
      await client.query(`INSERT INTO newsletter_subscribers (email) VALUES (${escape(n.email)}) ON CONFLICT (email) DO NOTHING;`);
    }

    // Terminal Commands
    for (const cmd of terminalCommands) {
      await client.query(`INSERT INTO terminal_commands (id, command, description, response, is_html) VALUES (${escape(cmd.id)}, ${escape(cmd.command)}, ${escape(cmd.description)}, ${escape(cmd.response)}, ${escape(cmd.isHtml || false)}) ON CONFLICT (command) DO UPDATE SET description = EXCLUDED.description, response = EXCLUDED.response, is_html = EXCLUDED.is_html;`);
    }

    // SEO config
    if (coreConfig?.seo) {
      const s = coreConfig.seo;
      await client.query(`INSERT INTO seo_config (id, site_title, site_description, favicon_url) VALUES ('data', ${escape(s.siteTitle)}, ${escape(s.siteDescription)}, ${escape(s.faviconUrl)}) ON CONFLICT (id) DO UPDATE SET site_title = EXCLUDED.site_title, site_description = EXCLUDED.site_description, favicon_url = EXCLUDED.favicon_url;`);

      if (Array.isArray(s.routes)) {
        for (const r of s.routes) {
          await client.query(`INSERT INTO seo_routes (id, path, title, description, changefreq, priority) VALUES (${escape(r.id)}, ${escape(r.path)}, ${escape(r.title)}, ${escape(r.description)}, ${escape(r.changefreq || 'weekly')}, ${escape(r.priority || 0.50)}) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, changefreq = EXCLUDED.changefreq, priority = EXCLUDED.priority;`);
        }
      }
    }

    // Resource Categories Tree Structure
    if (Array.isArray(coreConfig?.resourceCategories)) {
      async function insertCategoryNode(node, parentId = null) {
        await client.query(`INSERT INTO resource_categories (id, name, parent_id) VALUES (${escape(node.id)}, ${escape(node.name)}, ${escape(parentId)}) ON CONFLICT (id) DO NOTHING;`);
        if (Array.isArray(node.children)) {
          for (const child of node.children) {
            await insertCategoryNode(child, node.id);
          }
        }
      }
      for (const cat of coreConfig.resourceCategories) {
        await insertCategoryNode(cat);
      }
    }

    // Resources (Catalog documents)
    for (const r of resources) {
      await client.query(`INSERT INTO resources (id, title, description, pdf_url, thumbnail_url, source, date_added) VALUES (${escape(r.id)}, ${escape(r.title)}, ${escape(r.description)}, ${escape(r.pdfUrl)}, ${escape(r.thumbnailUrl || null)}, ${escape(r.source || null)}, ${escape(r.dateAdded)}) ON CONFLICT (id) DO NOTHING;`);
      
      // Resource Category mapping
      if (Array.isArray(r.categoryPath)) {
        for (const catId of r.categoryPath) {
          await client.query(`INSERT INTO resource_category_mapping (resource_id, category_id) VALUES (${escape(r.id)}, ${escape(catId)}) ON CONFLICT DO NOTHING;`);
        }
      }

      // Resource Tags mapping
      if (Array.isArray(r.tags)) {
        for (const tag of r.tags) {
          await client.query(`INSERT INTO resource_tags (resource_id, tag) VALUES (${escape(r.id)}, ${escape(tag)});`);
        }
      }
    }

    await client.query("COMMIT;");
    console.log("\x1b[32m✔ Migration Transaction Committed successfully over WebSockets!\x1b[0m");
    console.log("\x1b[32m✔ All documents migrated to Neon PostgreSQL database successfully.\x1b[0m\n");
  } catch (txError) {
    await client.query("ROLLBACK;");
    console.error("\x1b[31m✖ Migration Transaction Failed! Rolled back changes.\x1b[0m");
    throw txError;
  } finally {
    await client.end();
  }
}

runMigration().catch(err => {
  console.error("Critical Migration Error:", err);
  process.exit(1);
});
