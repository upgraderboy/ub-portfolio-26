import React, { useState, useEffect } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import "./blogs.css";

interface BlogsPageProps {
  navigate: (to: string) => void;
}

const BlogsPage: React.FC<BlogsPageProps> = ({ navigate }) => {
  const { fetchBlogs, portfolioData, subscribeToNewsletter } = usePortfolioData();
  const [allBlogs, setAllBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState<any[]>([]);

  // Subscriber Newsletter States
  const [subEmail, setSubEmail] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);
  const [subError, setSubError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubLoading(true);
    setSubError("");
    setSubSuccess(false);
    try {
      await subscribeToNewsletter(subEmail.trim());
      setSubSuccess(true);
      setSubEmail("");
      setTimeout(() => setSubSuccess(false), 5000);
    } catch (err: any) {
      console.error("Subscription failed:", err);
      setSubError("Failed to subscribe. Please try again.");
    } finally {
      setSubLoading(false);
    }
  };

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch all blogs dynamically
  useEffect(() => {
    let active = true;
    fetchBlogs().then((list) => {
      if (active) {
        setAllBlogs(list);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [portfolioData.blogs, fetchBlogs]);

  // Filter based on search term & filter out drafts
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    const publicBlogs = allBlogs.filter((b) => b.status !== "draft");
    if (!term) {
      setFilteredBlogs(publicBlogs);
    } else {
      const filtered = publicBlogs.filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.content.toLowerCase().includes(term)
      );
      setFilteredBlogs(filtered);
    }
  }, [searchTerm, allBlogs]);

  // Helper to extract clean text from HTML for excerpt
  const getExcerpt = (html: string) => {
    const cleanText = html.replace(/<[^>]*>/g, " ");
    const trimmed = cleanText.trim().replace(/\s+/g, " ");
    if (trimmed.length > 150) {
      return trimmed.substring(0, 150) + "...";
    }
    return trimmed;
  };

  return (
    <div className="blogs-page__container">
      {/* Page Header */}
      <header className="blogs-page__header">
        <h1 className="blogs-page__title">Blog Feed</h1>
        <p className="blogs-page__subtitle">Technical writeups, design patterns, and engineering workflows</p>
      </header>

      {/* Navigation & Search Bar */}
      <div className="blogs-page__nav">
        <button className="blogs-page__back-btn" onClick={() => navigate("/")}>
          <i className="uil uil-arrow-left"></i> Back to Portfolio
        </button>

        <div className="blogs-page__search-wrapper">
          <i className="uil uil-search blogs-page__search-icon"></i>
          <input
            type="text"
            className="blogs-page__search-input"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {loading ? (
        <div className="blogs__grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div className="blog__card skeleton-shimmer" key={n} style={{ border: "1px solid var(--border-color)", borderRadius: "1.25rem", overflow: "hidden" }}>
              <div className="blog__card-img-wrapper skeleton-item" style={{ height: "200px", width: "100%" }}></div>
              <div className="blog__card-content" style={{ padding: "1.5rem" }}>
                <div className="skeleton-item" style={{ height: "14px", width: "35%", marginBottom: "12px" }}></div>
                <div className="skeleton-item" style={{ height: "22px", width: "85%", marginBottom: "16px" }}></div>
                <div className="skeleton-item" style={{ height: "14px", width: "100%", marginBottom: "8px" }}></div>
                <div className="skeleton-item" style={{ height: "14px", width: "90%", marginBottom: "20px" }}></div>
                <div className="skeleton-item" style={{ height: "16px", width: "40%" }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Articles Grid */}
          {filteredBlogs.length > 0 ? (
            <div className="blogs__grid">
              {filteredBlogs.map((blog) => (
                <div className="blog__card" key={blog.id}>
                  <div className="blog__card-img-wrapper">
                    {blog.coverImage ? (
                      <img src={blog.coverImage} alt={blog.title} className="blog__card-img" />
                    ) : (
                      <div
                        className="blog__card-img"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(100, 116, 139, 0.1)",
                          color: "var(--text-color-light)",
                          fontSize: "2.5rem",
                          height: "100%",
                        }}
                      >
                        <i className="uil uil-image"></i>
                      </div>
                    )}
                  </div>

                  <div className="blog__card-content">
                    <span className="blog__card-date">
                      <i className="uil uil-calendar-alt"></i> {blog.date}
                    </span>
                    <h3 className="blog__card-title">{blog.title}</h3>
                    <p className="blog__card-excerpt">{getExcerpt(blog.content)}</p>
                    <div className="blog__card-link" onClick={() => navigate(`/blogs/${blog.id}`)}>
                      Read Post <i className="uil uil-arrow-right"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 2rem", border: "1px dashed var(--border-color)", borderRadius: "1rem", backgroundColor: "var(--container-color)", color: "var(--text-color-light)", gridColumn: "1 / -1" }}>
              <i className="uil uil-search-minus" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem", color: "var(--first-color)" }}></i>
              <h3 style={{ color: "var(--title-color)", marginBottom: "0.5rem" }}>No matching articles found</h3>
              <p>Try refining your search keyword or browse other sections.</p>
            </div>
          )}
        </>
      )}

      {/* Premium Glassmorphic Newsletter Subscription Form */}
      <section className="blogs-page__newsletter" style={{ marginTop: "5rem" }}>
        <div 
          style={{
            background: "linear-gradient(135deg, rgba(100, 116, 139, 0.05) 0%, rgba(100, 116, 139, 0.08) 100%)",
            border: "1px solid rgba(100, 116, 139, 0.15)",
            borderRadius: "1.5rem",
            padding: "3rem 2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            rowGap: "1.5rem",
            maxWidth: "600px",
            margin: "0 auto",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)"
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(1, 195, 105, 0.08)", color: "var(--green-color)", fontSize: "1.8rem", marginBottom: "0.25rem" }}>
            <i className="uil uil-envelope-alt"></i>
          </div>
          <div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--title-color)", marginBottom: "0.5rem" }}>Stay in the Loop</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-color-light)", maxWidth: "450px", margin: "0 auto", lineHeight: "1.6" }}>
              Subscribe to get notified about new technical articles, software architecture write-ups, and developer resources.
            </p>
          </div>

          <form onSubmit={handleSubscribe} style={{ display: "flex", width: "100%", maxWidth: "450px", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required
              value={subEmail}
              onChange={(e) => setSubEmail(e.target.value)}
              disabled={subLoading}
              style={{
                flex: "1 1 250px",
                padding: "0.8rem 1.2rem",
                borderRadius: "2rem",
                border: "1px solid rgba(100, 116, 139, 0.2)",
                backgroundColor: "var(--container-color)",
                color: "var(--title-color)",
                fontSize: "0.85rem",
                outline: "none",
                transition: "border-color 0.25s"
              }}
            />
            <button 
              type="submit" 
              disabled={subLoading}
              style={{
                flex: "0 0 auto",
                padding: "0.8rem 1.8rem",
                borderRadius: "2rem",
                backgroundColor: "var(--green-color)",
                color: "#fff",
                border: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.1s",
                display: "inline-flex",
                alignItems: "center",
                columnGap: "0.5rem"
              }}
            >
              {subLoading ? (
                <div className="portfolio-loader-circle" style={{ width: "14px", height: "14px", borderWidth: "2px", borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#fff" }} />
              ) : null}
              Subscribe
            </button>
          </form>

          {subSuccess && (
            <div style={{ color: "var(--green-color)", fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <i className="uil uil-check-circle" style={{ fontSize: "1.1rem" }}></i> Thanks for subscribing!
            </div>
          )}
          {subError && (
            <div style={{ color: "red", fontSize: "0.85rem", fontWeight: 500 }}>
              {subError}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogsPage;
