#!/usr/bin/env node

/**
 * ESM Node.js Post-Build Prerender Script (Neon PostgreSQL version).
 * Generates static HTML folders for all dynamic portfolio routes (blogs, memories, projects, resources).
 * Pre-injects optimized titles, meta descriptions, open graph tags, and twitter cards.
 * Ensures search crawlers and social share scrapers get perfect static SEO metadata.
 * Compiles a compliant sitemap.xml in the dist/ folder.
 */

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { Client } from "@neondatabase/serverless";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standard mock initial values fallback (matches portfolio schema)
const localInitialData = {
  home: {
    name: "Ankit Bhuria",
    subtitle: "Software Developer",
    description: "👨‍💻 Software Developer | Tech Enthusiast | Learn In Public Advocate | MERN & Next JS |"
  },
  about: {
    description: "Full Stack Developer using MERN and Next.js, I create web apps with UI / UX user interface and make robust backend applications.",
    experienceYears: "02+",
    completedProjects: "20+",
    supportAvailability: "Online 24/7",
    cvUrl: "",
    imageUrl: ""
  },
  seo: {
    siteTitle: "Ankit Bhuria | Portfolio",
    siteDescription: "Official website and portfolio of Ankit Bhuria.",
    faviconUrl: "/favicon.ico",
    routes: [
      { id: "route-home", path: "/", title: "Home", description: "Welcome to my portfolio website." },
      { id: "route-blogs", path: "/blogs", title: "Blogs", description: "Read my latest technical articles." },
      { id: "route-memories", path: "/memories", title: "Memories", description: "Snapshots of my tech journey." },
      { id: "route-resources", path: "/resources", title: "Resources", description: "Developer cheat sheets and PDF booklets." }
    ]
  }
};

async function prerender() {
  console.log("\n\x1b[35m=== Upgrader Boy Post-Build Prerender & Sitemap Generator ===\x1b[0m\n");

  const buildDir = path.join(process.cwd(), "dist");
  const buildHtmlPath = path.join(buildDir, "index.html");

  if (!fs.existsSync(buildHtmlPath)) {
    console.error("Error: index.html not found in dist/ folder.");
    console.log("Please run `npm run build` or `vite build` first to compile the web assets.\n");
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(buildHtmlPath, "utf8");
  let data = localInitialData;
  let useLiveDb = false;

  // 1. Fetch live records from Neon PostgreSQL via WebSocket Client
  if (process.env.DATABASE_URL) {
    try {
      console.log("\x1b[32m✔ Connecting to Neon PostgreSQL for live SEO metadata extraction...\x1b[0m");
      const client = new Client({ connectionString: process.env.DATABASE_URL });
      await client.connect();

      const [
        homeRes,
        aboutRes,
        projectsRes,
        memoriesRes,
        blogsRes,
        resourcesRes,
        seoConfigRes,
        seoRoutesRes
      ] = await Promise.all([
        client.query("SELECT * FROM portfolio_home WHERE id = 'data'"),
        client.query("SELECT * FROM portfolio_about WHERE id = 'data'"),
        client.query("SELECT * FROM projects"),
        client.query("SELECT * FROM memories"),
        client.query("SELECT * FROM blogs WHERE status = 'public'"),
        client.query("SELECT * FROM resources"),
        client.query("SELECT * FROM seo_config WHERE id = 'data'"),
        client.query("SELECT * FROM seo_routes")
      ]);

      await client.end();

      data = {
        home: homeRes.rows[0] || localInitialData.home,
        about: aboutRes.rows[0] || localInitialData.about,
        projects: projectsRes.rows,
        memories: memoriesRes.rows,
        blogs: blogsRes.rows,
        resources: resourcesRes.rows,
        seo: {
          siteTitle: seoConfigRes.rows[0]?.site_title || localInitialData.seo.siteTitle,
          siteDescription: seoConfigRes.rows[0]?.site_description || localInitialData.seo.siteDescription,
          faviconUrl: seoConfigRes.rows[0]?.favicon_url || localInitialData.seo.faviconUrl,
          routes: seoRoutesRes.rows.map(r => ({
            id: r.id,
            path: r.path,
            title: r.title,
            description: r.description,
            changefreq: r.changefreq || 'weekly',
            priority: Number(r.priority) || 0.50
          }))
        }
      };
      useLiveDb = true;
      console.log("✔ Live SEO records fetched successfully from Neon.");
    } catch (readError) {
      console.warn("⚠ Failed to fetch live database records, using local dataset fallback:", readError.message);
    }
  } else {
    console.log("ℹ DATABASE_URL not set: using offline fallbacks for prerender compilation.");
  }

  const seo = data.seo || localInitialData.seo;
  const siteTitle = seo.siteTitle;
  const siteDescription = seo.siteDescription;

  // Helper function to replace title and meta description tags in html
  function customizeHtml(title, description, canonicalUrl) {
    let html = baseHtml;
    
    // Replace <title>
    html = html.replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`);
    
    // Replace <meta name="description">
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, `<meta name="description" content="${description}" />`);
    html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${description}" />`);
    html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:description" content="${description}" />`);

    // Replace Titles
    html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:title" content="${title}" />`);

    // Replace canonical links
    if (canonicalUrl) {
      html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/gi, `<link rel="canonical" href="${canonicalUrl}" />`);
    }

    return html;
  }

  // List of routes to pre-generate
  const tasks = [];

  // 1. Static Sub-routes
  if (Array.isArray(seo.routes)) {
    seo.routes.forEach(r => {
      const pageTitle = r.path === "/" ? siteTitle : `${r.title} | ${siteTitle}`;
      const pageDesc = r.description;
      const routeUrl = `https://upgraderboy.tech${r.path}`;
      
      tasks.push({
        path: r.path,
        title: pageTitle,
        description: pageDesc,
        url: routeUrl,
        changefreq: r.changefreq || 'weekly',
        priority: r.priority || 0.50
      });
    });
  }

  // 2. Dynamic Blog Articles (/blogs/:id)
  if (Array.isArray(data.blogs)) {
    data.blogs.forEach(b => {
      const pageTitle = `${b.title} | Blogs | ${siteTitle}`;
      const plainExcerpt = b.content ? b.content.replace(/<[^>]*>/g, "").substring(0, 155).trim().replace(/\s+/g, " ") : "";
      const pageDesc = plainExcerpt || `Read ${b.title} on Upgrader Boy Blogs.`;
      const routeUrl = `https://upgraderboy.tech/blogs/${b.id}`;

      tasks.push({
        path: `/blogs/${b.id}`,
        title: pageTitle,
        description: pageDesc,
        url: routeUrl,
        changefreq: 'monthly',
        priority: 0.60
      });
    });
  }

  // 3. Dynamic Memories (/memories/:id)
  if (Array.isArray(data.memories)) {
    data.memories.forEach(m => {
      const pageTitle = `${m.title} | Memories | ${siteTitle}`;
      const pageDesc = m.description ? m.description.substring(0, 155).trim() : `View ${m.title} gallery.`;
      const routeUrl = `https://upgraderboy.tech/memories/${m.id}`;

      tasks.push({
        path: `/memories/${m.id}`,
        title: pageTitle,
        description: pageDesc,
        url: routeUrl,
        changefreq: 'monthly',
        priority: 0.40
      });
    });
  }

  // 4. Dynamic Projects (/projects/:id)
  if (Array.isArray(data.projects)) {
    data.projects.forEach(p => {
      const pageTitle = `${p.title} | Projects | ${siteTitle}`;
      const pageDesc = p.description ? p.description.substring(0, 155).trim() : `Check out ${p.title} project details.`;
      const routeUrl = `https://upgraderboy.tech/projects/${p.id}`;

      tasks.push({
        path: `/projects/${p.id}`,
        title: pageTitle,
        description: pageDesc,
        url: routeUrl,
        changefreq: 'monthly',
        priority: 0.70
      });
    });
  }

  // 5. Dynamic Resources (/resources/:id)
  if (Array.isArray(data.resources)) {
    data.resources.forEach(r => {
      const pageTitle = `${r.title} | Resources | ${siteTitle}`;
      const pageDesc = r.description ? r.description.substring(0, 155).trim() : `Download ${r.title} resource booklet.`;
      const routeUrl = `https://upgraderboy.tech/resources/${r.id}`;

      tasks.push({
        path: `/resources/${r.id}`,
        title: pageTitle,
        description: pageDesc,
        url: routeUrl,
        changefreq: 'monthly',
        priority: 0.65
      });
    });
  }

  // Run SSG folder generator tasks
  console.log(`\nStarting pre-render injection for ${tasks.length} routes...`);
  tasks.forEach(t => {
    // Skip homepage "/" since it's dist/index.html
    if (t.path === "/") return;

    // Standardize folder structure
    const routeFolder = path.join(buildDir, ...t.path.split("/").filter(p => p.length > 0));
    if (!fs.existsSync(routeFolder)) {
      fs.mkdirSync(routeFolder, { recursive: true });
    }

    const injectedHtml = customizeHtml(t.title, t.description, t.url);
    fs.writeFileSync(path.join(routeFolder, "index.html"), injectedHtml, "utf8");
    console.log(`  ✔ Pre-rendered: ${t.path}`);
  });

  // Customize home index.html as well
  const homeTask = tasks.find(t => t.path === "/");
  if (homeTask) {
    const homeHtml = customizeHtml(homeTask.title, homeTask.description, homeTask.url);
    fs.writeFileSync(buildHtmlPath, homeHtml, "utf8");
    console.log("  ✔ Injected site metadata to root index.html");
  }

  // 6. Generate sitemap.xml
  console.log("\nCompiling sitemap.xml in dist/ folder...");
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  tasks.forEach(t => {
    sitemapXml += `  <url>\n`;
    sitemapXml += `    <loc>${t.url}</loc>\n`;
    sitemapXml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    sitemapXml += `    <changefreq>${t.changefreq}</changefreq>\n`;
    sitemapXml += `    <priority>${Number(t.priority).toFixed(2)}</priority>\n`;
    sitemapXml += `  </url>\n`;
  });

  sitemapXml += `</urlset>\n`;
  
  fs.writeFileSync(path.join(buildDir, "sitemap.xml"), sitemapXml, "utf8");
  console.log("✔ sitemap.xml compiled successfully.");

  console.log("\n\x1b[32m✔ Prerender SSG and Sitemap compilation completed successfully!\x1b[0m\n");
}

prerender().catch(err => {
  console.error("Prerender pipeline failed:", err);
  process.exit(1);
});
