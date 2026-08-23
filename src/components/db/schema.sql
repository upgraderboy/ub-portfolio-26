-- PostgreSQL normalized DDL Database Schema for Upgrader Boy Portfolio
-- Fully structured to mirror Firestore collections & structures for easy SQL migration

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(128) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    phone_number VARCHAR(100),
    photo_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Portfolio Home Config Singleton
CREATE TABLE IF NOT EXISTS portfolio_home (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'data',
    name VARCHAR(255),
    subtitle VARCHAR(255),
    description TEXT,
    image_url TEXT
);

-- 3. Portfolio About Config Singleton
CREATE TABLE IF NOT EXISTS portfolio_about (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'data',
    description TEXT,
    experience_years VARCHAR(50),
    completed_projects VARCHAR(50),
    support_availability VARCHAR(50),
    cv_url TEXT,
    image_url TEXT
);

-- 4. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(100) NOT NULL, -- e.g., 'Intermediate', 'Advanced'
    category VARCHAR(50) NOT NULL -- 'frontend' or 'backend'
);

-- 5. Services Table
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(128) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    modal_title VARCHAR(255),
    modal_description TEXT
);

-- 6. Service Points Table (Child of Services)
CREATE TABLE IF NOT EXISTS service_points (
    id VARCHAR(128) PRIMARY KEY,
    service_id VARCHAR(128) REFERENCES services(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    link TEXT
);

-- 7. Qualifications Table
CREATE TABLE IF NOT EXISTS qualifications (
    id VARCHAR(128) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    calendar VARCHAR(100),
    type VARCHAR(50) NOT NULL -- 'education' or 'experience'
);

-- 8. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(128) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    demo_url TEXT,
    buy_url TEXT,
    github_url TEXT
);

-- 9. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(128) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

-- 10. Memories Table
CREATE TABLE IF NOT EXISTS memories (
    id VARCHAR(128) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    date_label VARCHAR(100)
);

-- 11. Memory Images Table (Child of Memories)
CREATE TABLE IF NOT EXISTS memory_images (
    id SERIAL PRIMARY KEY,
    memory_id VARCHAR(128) REFERENCES memories(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

-- 12. Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id VARCHAR(128) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL, -- Rich-text HTML editor string
    cover_image TEXT,
    status VARCHAR(50) DEFAULT 'public', -- 'public' or 'draft'
    published_date VARCHAR(100)
);

-- 12.5 Blog Tags Table
CREATE TABLE IF NOT EXISTS blog_tags (
    id SERIAL PRIMARY KEY,
    blog_id VARCHAR(128) REFERENCES blogs(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL
);

-- 13. Blog Likes Table
CREATE TABLE IF NOT EXISTS blog_likes (
    id VARCHAR(128) PRIMARY KEY, -- usually composite '${blogId}_${userId}'
    blog_id VARCHAR(128) REFERENCES blogs(id) ON DELETE CASCADE,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Blog Comments Table (Supports nested replies via self-referencing relationship)
CREATE TABLE IF NOT EXISTS blog_comments (
    id VARCHAR(128) PRIMARY KEY,
    blog_id VARCHAR(128) REFERENCES blogs(id) ON DELETE CASCADE,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    user_avatar TEXT,
    content TEXT NOT NULL,
    parent_comment_id VARCHAR(128) REFERENCES blog_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. SEO Config Singleton Table
CREATE TABLE IF NOT EXISTS seo_config (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'data',
    site_title VARCHAR(255) NOT NULL,
    site_description TEXT NOT NULL,
    favicon_url TEXT
);

-- 16. SEO Routes Table (Child of SEO Config)
CREATE TABLE IF NOT EXISTS seo_routes (
    id VARCHAR(128) PRIMARY KEY,
    path VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    changefreq VARCHAR(50) DEFAULT 'weekly',
    priority NUMERIC(3,2) DEFAULT 0.50
);

-- 17. Resource Categories Table (Recursive tree structure)
CREATE TABLE IF NOT EXISTS resource_categories (
    id VARCHAR(128) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id VARCHAR(128) REFERENCES resource_categories(id) ON DELETE CASCADE
);

-- 18. Resources Table
CREATE TABLE IF NOT EXISTS resources (
    id VARCHAR(128) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    pdf_url TEXT NOT NULL,
    thumbnail_url TEXT,
    source TEXT,
    date_added VARCHAR(100)
);

-- 19. Resource Category Mapping (Many-to-Many or node path mapping)
CREATE TABLE IF NOT EXISTS resource_category_mapping (
    id SERIAL PRIMARY KEY,
    resource_id VARCHAR(128) REFERENCES resources(id) ON DELETE CASCADE,
    category_id VARCHAR(128) REFERENCES resource_categories(id) ON DELETE CASCADE
);

-- 20. Resource Tags Table
CREATE TABLE IF NOT EXISTS resource_tags (
    id SERIAL PRIMARY KEY,
    resource_id VARCHAR(128) REFERENCES resources(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL
);

-- 21. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 22. Terminal Commands Table (Custom Shell Commands)
CREATE TABLE IF NOT EXISTS terminal_commands (
    id VARCHAR(128) PRIMARY KEY,
    command VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    response TEXT NOT NULL,
    is_html BOOLEAN DEFAULT FALSE
);

-- 23. Admin Credentials Table (Secure credentials storage)
CREATE TABLE IF NOT EXISTS admin_credentials (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'admin',
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Query Performance optimization
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_service_points_service ON service_points(service_id);
CREATE INDEX IF NOT EXISTS idx_memory_images_memory ON memory_images(memory_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent ON blog_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_resource_tags_resource ON resource_tags(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_mapping_resource ON resource_category_mapping(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_categories_parent ON resource_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_terminal_commands_key ON terminal_commands(command);

