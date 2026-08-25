import React, { useEffect, useState } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import "./resources.css";

interface ResourcesSectionProps {
  navigate: (to: string) => void;
}

const ResourcesSection: React.FC<ResourcesSectionProps> = ({ navigate }) => {
  const { portfolioData } = usePortfolioData();
  const [activeCategory, setActiveCategory] = useState("All");
  const [displayedResources, setDisplayedResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const list = portfolioData.resources || [];
    const filtered = activeCategory === "All"
      ? list
      : list.filter((res) => res.categoryPath && res.categoryPath.includes(activeCategory));
    setDisplayedResources(filtered.slice(0, 3));
    setLoading(false);
  }, [portfolioData.resources, activeCategory]);

  // Resolves the category path IDs into a clean hierarchy breadcrumb e.g. B.Tech › CS › Books
  const resolveCategoryPathNames = (pathIds: string[]): string => {
    if (!pathIds || pathIds.length === 0) return "General";
    const names: string[] = [];
    let currentNodes = portfolioData.resourceCategories || [];

    for (const id of pathIds) {
      const node: any = currentNodes.find((n: any) => n.id === id);
      if (node) {
        names.push(node.name);
        currentNodes = node.children || [];
      } else {
        break;
      }
    }
    return names.join(" › ");
  };

  if (loading) {
    return (
      <section className="resources__section section" id="resources-section">
        <h2 className="section__title">Resources</h2>
        <span className="section__subtitle">Technical Documents & Study Guides</span>
        <div className="resources__container container">
          <div className="resources__grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "1.5rem" }}>
            {[1, 2, 3].map((n) => (
              <div className="resources__book-card skeleton-loader" key={n} style={{ opacity: 0.6 }}>
                <div className="resources__book-wrapper skeleton" style={{ height: "180px", width: "130px", borderRadius: "8px" }}></div>
                <div className="resources__book-details" style={{ width: "100%" }}>
                  <div className="skeleton" style={{ height: "14px", width: "40%", marginBottom: "0.5rem" }}></div>
                  <div className="skeleton" style={{ height: "22px", width: "80%", marginBottom: "0.5rem" }}></div>
                  <div className="skeleton" style={{ height: "14px", width: "95%", marginBottom: "0.75rem" }}></div>
                  <div className="skeleton" style={{ height: "30px", width: "120px" }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayedResources.length === 0) {
    return null; // Don't render section if no resources exist yet
  }

  return (
    <section className="resources__section section" id="resources-section">
      <h2 className="section__title">Resources Catalog</h2>
      <span className="section__subtitle">Lecture Notes, Guides & Technical Sheets</span>

      {/* Category Filter Tabs */}
      <div className="resources__tabs container">
        <button
          className={`resources__tab-btn ${activeCategory === "All" ? "active" : ""}`}
          onClick={() => setActiveCategory("All")}
        >
          <i className="uil uil-cube"></i> All Material
        </button>
        {portfolioData.resourceCategories?.map((cat: any) => (
          <button
            key={cat.id}
            className={`resources__tab-btn ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <i className="uil uil-folder"></i> {cat.name}
          </button>
        ))}
      </div>

      <div className="resources__container container">
        {/* Terminal Header Info Panel - Dev Theme */}
        <div 
          className="resources-section__hud-panel"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "0.75rem",
            padding: "0.75rem 1.25rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.78rem",
            fontFamily: "'Fira Code', monospace",
            color: "var(--text-color-light)",
            borderLeft: "3px solid var(--green-color)"
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="memories__hud-blink" style={{ color: "var(--green-color)" }}>●</span>
            SYS: CATALOG_MOUNTED
          </span>
          <span>RECORDS_COUNT: {portfolioData.resources?.length || 0}</span>
        </div>

        <div className="resources__grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "2rem" }}>
          {displayedResources.map((res) => (
            <div className="resources__book-card" key={res.id}>
              {/* Technical cyber corners */}
              <div className="resources__card-corner resources__card-corner--tl"></div>
              <div className="resources__card-corner resources__card-corner--tr"></div>
              <div className="resources__card-corner resources__card-corner--bl"></div>
              <div className="resources__card-corner resources__card-corner--br"></div>

              {/* 3D Physical Flipping Book cover in preview container */}
              <div className="resources__card-preview-area">
                <div className="resources__book-wrapper">
                  <div className="resources__book">
                    {/* Front Cover */}
                    <div className="resources__book-cover">
                      {res.thumbnailUrl ? (
                        <img src={res.thumbnailUrl} alt={res.title} className="resources__book-img" />
                      ) : (
                        <div className="resources__book-fallback" style={{ padding: "0.75rem", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%" }}>
                          <i className="uil uil-file-pdf" style={{ fontSize: "2rem", color: "var(--green-color)" }}></i>
                          <span style={{ fontSize: "0.65rem", fontWeight: "700", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textTransform: "uppercase", color: "var(--title-color)", marginTop: "0.25rem", wordBreak: "break-word", lineHeight: "1.2" }}>
                            {res.title}
                          </span>
                        </div>
                      )}
                      {/* Glossy Overlay */}
                      <div className="resources__book-overlay"></div>
                    </div>
                    {/* Spine */}
                    <div className="resources__book-spine"></div>
                    {/* Paper Pages Stack */}
                    <div className="resources__book-pages"></div>
                    {/* Back Cover */}
                    <div className="resources__book-back"></div>
                    {/* Bookmark Ribbon */}
                    <div className="resources__book-ribbon"></div>
                  </div>
                </div>
              </div>

              {/* Metadata and Actions */}
              <div className="resources__book-details">
                <span className="resources__card-category" title={resolveCategoryPathNames(res.categoryPath)}>
                  {resolveCategoryPathNames(res.categoryPath)}
                </span>
                <h3 className="resources__card-title">
                  {res.title}
                </h3>
                <p className="resources__card-description">
                  {res.description}
                </p>

                {/* Technical tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginBottom: "1.25rem" }}>
                  {res.tags && res.tags.slice(0, 2).map((tag: string, idx: number) => (
                    <span key={idx} className="admin__tag" style={{ fontSize: "0.65rem", padding: "2px 6px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "4px", color: "var(--text-color-light)" }}>
                      #{tag}
                    </span>
                  ))}
                  {res.source && (
                    <span className="admin__tag" style={{ fontSize: "0.65rem", padding: "2px 6px", background: "rgba(0,255,30,0.03)", border: "1px dashed rgba(0,255,30,0.12)", borderRadius: "4px", color: "var(--green-color)" }}>
                      {res.source.length > 15 ? res.source.substring(0, 15) + "..." : res.source}
                    </span>
                  )}
                </div>

                <div className="resources__book-actions">
                  <a href={res.pdfUrl} target="_blank" rel="noopener noreferrer" className="resources__btn-primary">
                    <i className="uil uil-import"></i> Get PDF
                  </a>
                  <button type="button" className="resources__btn-secondary" onClick={() => navigate("/resources")} title="Live 3D Read">
                    <i className="uil uil-cube"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="blogs__view-all-container" style={{ marginTop: "3rem" }}>
          <button className="blogs__view-all-btn" onClick={() => navigate("/resources")}>
            Browse Folders & Library <i className="uil uil-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
