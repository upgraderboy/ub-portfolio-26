import React, { useState, useEffect } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import ProjectItems from "./ProjectItems";
import "./project.css";

interface ProjectsPageProps {
  navigate: (to: string) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ navigate }) => {
  const { fetchProjects, portfolioData } = usePortfolioData();
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [item, setItem] = useState({ name: "All" });
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [active, setActive] = useState(0);

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch all projects dynamically
  useEffect(() => {
    let active = true;
    fetchProjects().then((list) => {
      if (active) {
        setAllProjects(list);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [portfolioData.projects, fetchProjects]);

  // Dynamically derive categories from projects list
  const categories = ["All", ...Array.from(new Set(allProjects.map((p) => p.category)))];

  // Filter projects by category AND search term
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    const newProjects = allProjects.filter((project) => {
      const matchesCategory = item.name === "All" || project.category === item.name;
      const matchesSearch = !term || 
        project.title.toLowerCase().includes(term) || 
        (project.category && project.category.toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });
    setFilteredProjects(newProjects);
  }, [item, searchTerm, allProjects]);

  const handleClick = (name: string, index: number) => {
    setItem({ name });
    setActive(index);
  };

  return (
    <div className="blogs-page__container" style={{ padding: "6rem 1.5rem 4rem 1.5rem" }}>
      {/* Header */}
      <header className="blogs-page__header" style={{ marginBottom: "2rem" }}>
        <h1 className="blogs-page__title">All Projects</h1>
        <p className="blogs-page__subtitle">A compilation of technical products, applications, and source code repositories</p>
      </header>

      {/* Navigation & Search Bar */}
      <div className="blogs-page__nav" style={{ marginBottom: "2.5rem" }}>
        <button className="blogs-page__back-btn" onClick={() => navigate("/")}>
          <i className="uil uil-arrow-left"></i> Back to Portfolio
        </button>

        <div className="blogs-page__search-wrapper">
          <i className="uil uil-search blogs-page__search-icon"></i>
          <input
            type="text"
            className="blogs-page__search-input"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {loading ? (
        <div className="project__container container grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div className="project__card skeleton-shimmer" key={n} style={{ border: "1px solid var(--border-color)", borderRadius: "1rem", padding: "1.25rem" }}>
              <div className="skeleton-item" style={{ height: "180px", borderRadius: "1rem", marginBottom: "1rem" }}></div>
              <div className="skeleton-item" style={{ height: "20px", width: "65%", marginBottom: "1.25rem" }}></div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div className="skeleton-item" style={{ height: "30px", width: "65px", borderRadius: "0.5rem" }}></div>
                <div className="skeleton-item" style={{ height: "30px", width: "65px", borderRadius: "0.5rem" }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Category Filter Headers */}
          <div className="project__filters" style={{ marginBottom: "3rem" }}>
            {categories.map((name, index) => {
              return (
                <span
                  className={`${active === index ? "active-work" : ""} project__item`}
                  key={index}
                  onClick={() => handleClick(name, index)}
                  style={{ cursor: "pointer" }}
                >
                  {name}
                </span>
              );
            })}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="project__container container grid">
              {filteredProjects.map((project, index) => {
                return <ProjectItems item={project} key={project.id || index} />;
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 2rem", border: "1px dashed var(--border-color)", borderRadius: "1rem", backgroundColor: "var(--container-color)", color: "var(--text-color-light)", gridColumn: "1 / -1" }}>
              <i className="uil uil-search-minus" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem", color: "var(--first-color)" }}></i>
              <h3 style={{ color: "var(--title-color)", marginBottom: "0.5rem" }}>No projects found</h3>
              <p>Try refining your search keyword or adjust the category filter.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsPage;
