import { pool } from "./db";

export async function getPortfolioData() {
  const [
    homeRes,
    aboutRes,
    skillsRes,
    servicesRes,
    servicePointsRes,
    qualificationsRes,
    projectsRes,
    testimonialsRes,
    memoriesRes,
    memoryImagesRes,
    blogsRes,
    blogTagsRes,
    seoConfigRes,
    seoRoutesRes,
    categoriesRes,
    resourcesRes,
    resourceCategoriesMapRes,
    resourceTagsRes,
    terminalRes
  ] = await Promise.all([
    pool.query("SELECT * FROM portfolio_home WHERE id = 'data'"),
    pool.query("SELECT * FROM portfolio_about WHERE id = 'data'"),
    pool.query("SELECT * FROM skills"),
    pool.query("SELECT * FROM services"),
    pool.query("SELECT * FROM service_points"),
    pool.query("SELECT * FROM qualifications"),
    pool.query("SELECT * FROM projects"),
    pool.query("SELECT * FROM testimonials"),
    pool.query("SELECT * FROM memories"),
    pool.query("SELECT * FROM memory_images"),
    pool.query("SELECT * FROM blogs"),
    pool.query("SELECT * FROM blog_tags"),
    pool.query("SELECT * FROM seo_config WHERE id = 'data'"),
    pool.query("SELECT * FROM seo_routes"),
    pool.query("SELECT * FROM resource_categories"),
    pool.query("SELECT * FROM resources"),
    pool.query("SELECT * FROM resource_category_mapping"),
    pool.query("SELECT * FROM resource_tags"),
    pool.query("SELECT * FROM terminal_commands")
  ]);

  // Format home
  const home = {
    name: homeRes.rows[0]?.name || "",
    subtitle: homeRes.rows[0]?.subtitle || "",
    description: homeRes.rows[0]?.description || "",
    imageUrl: homeRes.rows[0]?.image_url || ""
  };

  // Format about
  const about = {
    description: aboutRes.rows[0]?.description || "",
    experienceYears: aboutRes.rows[0]?.experience_years || "",
    completedProjects: aboutRes.rows[0]?.completed_projects || "",
    supportAvailability: aboutRes.rows[0]?.support_availability || "",
    cvUrl: aboutRes.rows[0]?.cv_url || "",
    imageUrl: aboutRes.rows[0]?.image_url || ""
  };

  // Format skills
  const skills = {
    frontend: skillsRes.rows.filter(s => s.category === "frontend").map(s => ({ name: s.name, level: s.level })),
    backend: skillsRes.rows.filter(s => s.category === "backend").map(s => ({ name: s.name, level: s.level }))
  };

  // Format services
  const services = servicesRes.rows.map(s => ({
    id: s.id,
    title: s.title,
    icon: s.icon,
    modalTitle: s.modal_title,
    modalDescription: s.modal_description,
    points: servicePointsRes.rows
      .filter(pt => pt.service_id === s.id)
      .map(pt => ({ id: pt.id, text: pt.text, link: pt.link }))
  }));

  // Format qualifications
  const qualification = {
    education: qualificationsRes.rows.filter(q => q.type === "education").map(q => ({ id: q.id, title: q.title, subtitle: q.subtitle, calendar: q.calendar })),
    experience: qualificationsRes.rows.filter(q => q.type === "experience").map(q => ({ id: q.id, title: q.title, subtitle: q.subtitle, calendar: q.calendar }))
  };

  // Format projects
  const projects = projectsRes.rows.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    image: p.image_url,
    demo: p.demo_url,
    buy: p.buy_url,
    github: p.github_url
  }));

  // Format testimonials
  const testimonials = testimonialsRes.rows.map(t => ({
    id: t.id,
    title: t.title,
    description: t.description,
    image: t.image_url
  }));

  // Format memories
  const memories = memoriesRes.rows.map(m => ({
    id: m.id,
    title: m.title,
    description: m.description,
    category: m.category,
    date: m.date_label,
    images: memoryImagesRes.rows
      .filter(img => img.memory_id === m.id)
      .map(img => img.image_url)
  }));

  // Format blogs
  const blogs = blogsRes.rows.map(b => ({
    id: b.id,
    title: b.title,
    content: b.content,
    coverImage: b.cover_image,
    status: b.status,
    date: b.published_date,
    tags: blogTagsRes.rows.filter(t => t.blog_id === b.id).map(t => t.tag)
  }));

  // Format seo
  const seo = {
    siteTitle: seoConfigRes.rows[0]?.site_title || "",
    siteDescription: seoConfigRes.rows[0]?.site_description || "",
    faviconUrl: seoConfigRes.rows[0]?.favicon_url || "",
    routes: seoRoutesRes.rows.map(r => ({
      id: r.id,
      path: r.path,
      title: r.title,
      description: r.description,
      changefreq: r.changefreq,
      priority: Number(r.priority)
    }))
  };

  // Format resource categories
  const categoriesList = categoriesRes.rows;
  const resourceCategories = buildCategoriesTree(categoriesList, null);

  // Format resources
  const resources = resourcesRes.rows.map(r => {
    const mapping = resourceCategoriesMapRes.rows.find(m => m.resource_id === r.id);
    const categoryPath = [];
    if (mapping) {
      let curr = categoriesList.find(c => c.id === mapping.category_id);
      while (curr) {
        categoryPath.unshift(curr.id);
        curr = categoriesList.find(c => c.id === curr.parent_id);
      }
    }

    return {
      id: r.id,
      title: r.title,
      description: r.description,
      pdfUrl: r.pdf_url,
      thumbnailUrl: r.thumbnail_url,
      source: r.source,
      date: r.date_added,
      categoryPath,
      tags: resourceTagsRes.rows.filter(t => t.resource_id === r.id).map(t => t.tag)
    };
  });

  // Format terminal commands
  const terminalCommands = terminalRes.rows.map(t => ({
    id: t.id,
    command: t.command,
    description: t.description,
    response: t.response,
    isHtml: t.is_html
  }));

  return {
    home,
    about,
    skills,
    services,
    qualification,
    projects,
    testimonials,
    memories,
    blogs,
    seo,
    resources,
    resourceCategories,
    terminalCommands
  };
}

function buildCategoriesTree(categoriesList: any[], parentId: string | null = null): any[] {
  return categoriesList
    .filter(cat => cat.parent_id === parentId)
    .map(cat => ({
      id: cat.id,
      name: cat.name,
      children: buildCategoriesTree(categoriesList, cat.id)
    }));
}
