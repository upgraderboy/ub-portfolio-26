import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  let client;
  try {
    const data = await req.json();
    client = await pool.connect();

    await client.query("BEGIN;");

    // Clear all existing data tables
    await client.query(
      "TRUNCATE TABLE blog_likes, blog_comments, blog_tags, blogs, memory_images, memories, testimonials, projects, qualifications, service_points, services, skills, portfolio_about, portfolio_home, seo_routes, seo_config, resource_tags, resource_category_mapping, resources, resource_categories, newsletter_subscribers, terminal_commands, users CASCADE;"
    );

    // Default admin mock user
    await client.query(
      `INSERT INTO users (id, name, email, role) VALUES ('mock-user-1', 'Ankit Bhuria', 'ankit@example.com', 'admin') ON CONFLICT DO NOTHING;`
    );

    // Home
    if (data.home) {
      const h = data.home;
      await client.query(
        "INSERT INTO portfolio_home (id, name, subtitle, description, image_url) VALUES ('data', $1, $2, $3, $4);",
        [h.name, h.subtitle, h.description, h.imageUrl]
      );
    }

    // About
    if (data.about) {
      const ab = data.about;
      await client.query(
        "INSERT INTO portfolio_about (id, description, experience_years, completed_projects, support_availability, cv_url, image_url) VALUES ('data', $1, $2, $3, $4, $5, $6);",
        [ab.description, ab.experienceYears, ab.completedProjects, ab.supportAvailability, ab.cvUrl, ab.imageUrl]
      );
    }

    // Skills
    if (data.skills) {
      if (Array.isArray(data.skills.frontend)) {
        for (const s of data.skills.frontend) {
          await client.query("INSERT INTO skills (name, level, category) VALUES ($1, $2, 'frontend');", [s.name, s.level]);
        }
      }
      if (Array.isArray(data.skills.backend)) {
        for (const s of data.skills.backend) {
          await client.query("INSERT INTO skills (name, level, category) VALUES ($1, $2, 'backend');", [s.name, s.level]);
        }
      }
    }

    // Services
    if (Array.isArray(data.services)) {
      for (const s of data.services) {
        await client.query(
          "INSERT INTO services (id, title, icon, modal_title, modal_description) VALUES ($1, $2, $3, $4, $5);",
          [s.id, s.title, s.icon, s.modalTitle, s.modalDescription]
        );
        if (Array.isArray(s.points)) {
          for (const pt of s.points) {
            const ptId = pt.id || Math.random().toString(36).substring(7);
            await client.query("INSERT INTO service_points (id, service_id, text, link) VALUES ($1, $2, $3, $4);", [
              ptId,
              s.id,
              pt.text,
              pt.link || null,
            ]);
          }
        }
      }
    }

    // Qualifications
    if (data.qualification) {
      if (Array.isArray(data.qualification.education)) {
        for (const q of data.qualification.education) {
          const qId = q.id || Math.random().toString(36).substring(7);
          await client.query(
            "INSERT INTO qualifications (id, title, subtitle, calendar, type) VALUES ($1, $2, $3, $4, 'education');",
            [qId, q.title, q.subtitle, q.calendar]
          );
        }
      }
      if (Array.isArray(data.qualification.experience)) {
        for (const q of data.qualification.experience) {
          const qId = q.id || Math.random().toString(36).substring(7);
          await client.query(
            "INSERT INTO qualifications (id, title, subtitle, calendar, type) VALUES ($1, $2, $3, $4, 'experience');",
            [qId, q.title, q.subtitle, q.calendar]
          );
        }
      }
    }

    // Projects
    if (Array.isArray(data.projects)) {
      for (const p of data.projects) {
        await client.query(
          "INSERT INTO projects (id, title, category, image_url, demo_url, buy_url, github_url) VALUES ($1, $2, $3, $4, $5, $6, $7);",
          [p.id, p.title, p.category, p.image, p.demo || null, p.buy || null, p.github || null]
        );
      }
    }

    // Testimonials
    if (Array.isArray(data.testimonials)) {
      for (const t of data.testimonials) {
        await client.query("INSERT INTO testimonials (id, title, description, image_url) VALUES ($1, $2, $3, $4);", [
          t.id,
          t.title,
          t.description,
          t.image,
        ]);
      }
    }

    // Memories
    if (Array.isArray(data.memories)) {
      for (const m of data.memories) {
        await client.query(
          "INSERT INTO memories (id, title, description, category, date_label) VALUES ($1, $2, $3, $4, $5);",
          [m.id, m.title, m.description, m.category, m.date || null]
        );
        if (Array.isArray(m.images)) {
          for (const img of m.images) {
            await client.query("INSERT INTO memory_images (memory_id, image_url) VALUES ($1, $2);", [m.id, img]);
          }
        }
      }
    }

    // Blogs
    if (Array.isArray(data.blogs)) {
      for (const b of data.blogs) {
        await client.query(
          "INSERT INTO blogs (id, title, content, cover_image, status, published_date) VALUES ($1, $2, $3, $4, $5, $6);",
          [b.id, b.title, b.content, b.coverImage || null, b.status || "public", b.date || null]
        );
        if (Array.isArray(b.tags)) {
          for (const t of b.tags) {
            await client.query("INSERT INTO blog_tags (blog_id, tag) VALUES ($1, $2);", [b.id, t]);
          }
        }
      }
    }

    // SEO Settings
    if (data.seo) {
      const s = data.seo;
      await client.query(
        "INSERT INTO seo_config (id, site_title, site_description, favicon_url) VALUES ('data', $1, $2, $3) ON CONFLICT (id) DO UPDATE SET site_title = EXCLUDED.site_title, site_description = EXCLUDED.site_description, favicon_url = EXCLUDED.favicon_url;",
        [s.siteTitle, s.siteDescription, s.faviconUrl]
      );

      if (Array.isArray(s.routes)) {
        for (const r of s.routes) {
          await client.query(
            "INSERT INTO seo_routes (id, path, title, description, changefreq, priority) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, changefreq = EXCLUDED.changefreq, priority = EXCLUDED.priority;",
            [r.id, r.path, r.title, r.description, r.changefreq || "weekly", r.priority || 0.5]
          );
        }
      }
    }

    // Resource Categories
    if (Array.isArray(data.resourceCategories)) {
      for (const cat of data.resourceCategories) {
        await insertCategoryNode(client, cat);
      }
    }

    // Resources
    if (Array.isArray(data.resources)) {
      for (const r of data.resources) {
        await client.query(
          "INSERT INTO resources (id, title, description, pdf_url, thumbnail_url, source, date_added) VALUES ($1, $2, $3, $4, $5, $6, $7);",
          [r.id, r.title, r.description, r.pdfUrl, r.thumbnailUrl || null, r.source || null, r.dateAdded || r.date]
        );

        // Category paths mapping
        if (Array.isArray(r.categoryPath) && r.categoryPath.length > 0) {
          const leafCategoryId = r.categoryPath[r.categoryPath.length - 1];
          await client.query(
            "INSERT INTO resource_category_mapping (resource_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;",
            [r.id, leafCategoryId]
          );
        }

        // Tags mapping
        if (Array.isArray(r.tags)) {
          for (const t of r.tags) {
            await client.query("INSERT INTO resource_tags (resource_id, tag) VALUES ($1, $2);", [r.id, t]);
          }
        }
      }
    }

    // Terminal Commands
    if (Array.isArray(data.terminalCommands)) {
      for (const cmd of data.terminalCommands) {
        await client.query(
          "INSERT INTO terminal_commands (id, command, description, response, is_html) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (command) DO UPDATE SET description = EXCLUDED.description, response = EXCLUDED.response, is_html = EXCLUDED.is_html;",
          [cmd.id, cmd.command, cmd.description, cmd.response, cmd.isHtml || false]
        );
      }
    }

    await client.query("COMMIT;");
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (client) {
      await client.query("ROLLBACK;");
    }
    console.error("Failed to commit save-portfolio-data transacted changes:", err);
    return NextResponse.json({ error: "Failed to save data: " + err.message }, { status: 500 });
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function insertCategoryNode(client: any, node: any, parentId: string | null = null) {
  await client.query(
    "INSERT INTO resource_categories (id, name, parent_id) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING;",
    [node.id, node.name, parentId]
  );
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      await insertCategoryNode(client, child, node.id);
    }
  }
}
