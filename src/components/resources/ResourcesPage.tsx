import React, { useState, useEffect } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import "./resources.css";

interface ResourcesPageProps {
  navigate: (to: string) => void;
}

const ResourcesPage: React.FC<ResourcesPageProps> = ({ navigate }) => {
  const { portfolioData, isLoading } = usePortfolioData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All"); // Matches node ID
  const [filteredResources, setFilteredResources] = useState<any[]>([]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Filter logic
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    const resources = portfolioData.resources || [];

    const filtered = resources.filter((res) => {
      // Recursive matching: matches if resource's categoryPath contains the selected node ID
      const matchesCategory = selectedCategory === "All" || (res.categoryPath && res.categoryPath.includes(selectedCategory));
      
      const matchesSearch = !term ||
        res.title.toLowerCase().includes(term) ||
        res.description.toLowerCase().includes(term) ||
        (res.source && res.source.toLowerCase().includes(term)) ||
        (res.tags && res.tags.some((tag: string) => tag.toLowerCase().includes(term)));

      return matchesCategory && matchesSearch;
    });

    setFilteredResources(filtered);
  }, [searchTerm, selectedCategory, portfolioData.resources]);

  // Helper to find children of active selected category node
  const getActiveFolderChildren = (): any[] => {
    if (selectedCategory === "All") {
      return portfolioData.resourceCategories || [];
    }
    
    const findNode = (nodes: any[], id: string): any => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children && node.children.length > 0) {
          const match = findNode(node.children, id);
          if (match) return match;
        }
      }
      return null;
    };

    const activeNode = findNode(portfolioData.resourceCategories || [], selectedCategory);
    return activeNode?.children || [];
  };

  // Helper to build active category breadcrumbs trail
  const getActiveBreadcrumbs = (): { id: string; name: string }[] => {
    const trail: { id: string; name: string }[] = [{ id: "All", name: "All Folders" }];
    if (selectedCategory === "All") return trail;

    const findPath = (nodes: any[], targetId: string, currentPath: { id: string; name: string }[]): boolean => {
      for (const node of nodes) {
        const newPath = [...currentPath, { id: node.id, name: node.name }];
        if (node.id === targetId) {
          trail.push(...newPath);
          return true;
        }
        if (node.children && node.children.length > 0) {
          if (findPath(node.children, targetId, newPath)) return true;
        }
      }
      return false;
    };

    findPath(portfolioData.resourceCategories || [], selectedCategory, []);
    return trail;
  };

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

  // Recursive Sidebar Folder Tree Visualizer Node
  const renderSidebarTreeNode = (node: any, depth = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedCategory === node.id;
    
    return (
      <div key={node.id} className="resources-page__tree-node" style={{ marginLeft: depth > 0 ? "0.75rem" : "0" }}>
        <div 
          className={`resources-page__node-header ${isSelected ? "active" : ""}`}
          onClick={() => setSelectedCategory(isSelected ? "All" : node.id)}
        >
          <span style={{ display: "flex", alignItems: "center", columnGap: "0.35rem" }}>
            <i 
              className={hasChildren ? "uil uil-folder" : "uil uil-file-alt"} 
              style={{ color: isSelected ? "var(--green-color)" : "var(--text-color-light)" }}
            ></i>
            {node.name}
          </span>
          {hasChildren && (
            <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>
              ({node.children.length})
            </span>
          )}
        </div>
        {hasChildren && node.children.map((child: any) => renderSidebarTreeNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="resources-page__container" style={{ padding: "6rem 1.5rem 4rem 1.5rem" }}>
      {/* Header */}
      <header className="resources-page__header" style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <h1 className="resources-page__title">Resources & Study Material</h1>
        <p className="resources-page__subtitle">
          Explore nested course folders, lecture notes, syllabus sheets, and dynamic directories
        </p>
      </header>

      {/* Navigation & Search Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <button className="resources-page__back-btn" onClick={() => navigate("/")}>
          <i className="uil uil-arrow-left"></i> Back to Portfolio
        </button>

        <div className="resources-page__search-wrapper">
          <i className="uil uil-search resources-page__search-icon"></i>
          <input
            type="text"
            className="resources-page__search-input"
            placeholder="Search resources, tags, authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <i className="uil uil-times resources-page__search-clear" onClick={() => setSearchTerm("")}></i>
          )}
        </div>
      </div>

      {/* Sidebar Grid Layout */}
      <div className="resources-page__layout">
        {/* Sidebar Folder Accordion (Desktop only) */}
        <div className="resources-page__desktop-sidebar">
          <aside className="resources-page__sidebar">
            <h3 className="resources-page__sidebar-title">
              <i className="uil uil-sitemap" style={{ color: "var(--green-color)" }}></i> Folders Hierarchy
            </h3>
            
            {/* Root Level selector */}
            <div 
              className={`resources-page__node-header ${selectedCategory === "All" ? "active" : ""}`}
              style={{ fontWeight: "600", marginBottom: "0.5rem" }}
              onClick={() => setSelectedCategory("All")}
            >
              <span style={{ display: "flex", alignItems: "center", columnGap: "0.35rem" }}>
                <i className="uil uil-apps"></i> All Categories
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {(portfolioData.resourceCategories || []).length > 0 ? (
                (portfolioData.resourceCategories || []).map((cat) => renderSidebarTreeNode(cat))
              ) : (
                <span style={{ fontSize: "0.8rem", color: "var(--text-color-light)", fontStyle: "italic" }}>
                  No categories configured.
                </span>
              )}
            </div>
          </aside>
        </div>

        {/* Catalog Grid View */}
        <main>
          {/* Mobile Folder Explorer (Mobile only) */}
          <div className="resources-page__mobile-explorer">
            {/* Mobile Breadcrumb explorer */}
            <div className="resources-page__mobile-breadcrumbs" style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexWrap: "wrap", marginBottom: "1rem", fontSize: "0.85rem" }}>
              {getActiveBreadcrumbs().map((b, idx) => (
                <React.Fragment key={b.id}>
                  {idx > 0 && <i className="uil uil-angle-right" style={{ color: "var(--text-color-light)", fontSize: "0.95rem" }}></i>}
                  <span 
                    style={{ 
                      color: idx === getActiveBreadcrumbs().length - 1 ? "var(--green-color)" : "var(--title-color)", 
                      fontWeight: idx === getActiveBreadcrumbs().length - 1 ? "600" : "500",
                      cursor: "pointer"
                    }}
                    onClick={() => setSelectedCategory(b.id)}
                  >
                    {b.name}
                  </span>
                </React.Fragment>
              ))}
            </div>

            {/* Horizontal scroll list of child categories */}
            {getActiveFolderChildren().length > 0 ? (
              <div className="resources-page__mobile-pills" style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.75rem", marginBottom: "1.5rem", WebkitOverflowScrolling: "touch" }}>
                {getActiveFolderChildren().map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "2rem",
                      border: "1px solid rgba(100, 116, 139, 0.15)",
                      backgroundColor: "var(--container-color)",
                      color: "var(--title-color)",
                      fontSize: "0.8rem",
                      whiteSpace: "nowrap",
                      display: "inline-flex",
                      alignItems: "center",
                      columnGap: "0.35rem",
                      cursor: "pointer",
                      transition: "0.2s"
                    }}
                    onClick={() => setSelectedCategory(child.id)}
                  >
                    <i className={child.children && child.children.length > 0 ? "uil uil-folder" : "uil uil-file-alt"} style={{ color: "var(--green-color)" }}></i>
                    {child.name}
                  </button>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: "0.75rem", color: "var(--text-color-light)", display: "block", marginBottom: "1.5rem", fontStyle: "italic" }}>
                📂 Deepest directory level.
              </span>
            )}
          </div>
          {isLoading ? (
            <div className="resources__grid">
              {[...Array(4)].map((_, i) => (
                <div className="resources__card skeleton-loader" key={i}>
                  <div className="resources__card-icon skeleton" style={{ height: "48px", width: "48px", borderRadius: "8px" }}></div>
                  <div className="resources__card-info" style={{ width: "100%" }}>
                    <div className="skeleton" style={{ height: "14px", width: "30%", marginBottom: "0.75rem", borderRadius: "4px" }}></div>
                    <div className="skeleton" style={{ height: "20px", width: "80%", marginBottom: "0.75rem", borderRadius: "4px" }}></div>
                    <div className="skeleton" style={{ height: "14px", width: "95%", marginBottom: "0.5rem", borderRadius: "4px" }}></div>
                    <div className="skeleton" style={{ height: "36px", width: "120px", borderRadius: "4px" }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="resources__grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "1.5rem" }}>
              {filteredResources.map((res) => (
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
                    
                    {res.source && (
                      <span className="resources__card-source" style={{ fontSize: "0.72rem", color: "var(--text-color-light)", display: "inline-flex", alignItems: "center", columnGap: "0.25rem", marginBottom: "0.5rem" }}>
                        <i className="uil uil-user"></i> Source: {res.source}
                      </span>
                    )}
                    
                    {res.tags && res.tags.length > 0 && (
                      <div className="resources__card-tags" style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginBottom: "1.25rem" }}>
                        {res.tags.slice(0, 2).map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="resources__card-tag"
                            style={{ fontSize: "0.65rem", padding: "2px 6px" }}
                            onClick={() => setSearchTerm(tag)}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="resources__book-actions">
                      <button
                        className="resources__btn-primary"
                        onClick={() => window.location.href = `/flipbook/index.html?file=${encodeURIComponent(res.id)}`}
                      >
                        <i className="uil uil-book-open"></i> Read
                      </button>

                      <button
                        className="resources__btn-secondary"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = res.pdfUrl;
                          a.target = "_blank";
                          a.download = res.title + ".pdf";
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}
                        title="Download PDF"
                      >
                        <i className="uil uil-import"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "5rem 1.5rem", color: "var(--text-color-light)" }}>
              <i className="uil uil-folder-question" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem", color: "var(--green-color)" }}></i>
              <h3>No catalog documents found</h3>
              <p>Try searching another keyword or select a different folder in the tree side panel.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ResourcesPage;
