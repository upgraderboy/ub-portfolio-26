import { useEffect, useState } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import ProjectItems from "./ProjectItems";

interface ProjectsProps {
  navigate: (to: string) => void;
}

function Projects({ navigate }: ProjectsProps) {
  const { fetchProjects, portfolioData } = usePortfolioData();
  const [displayedProjects, setDisplayedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchProjects(3).then((list) => {
      if (active) {
        setDisplayedProjects(list);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [portfolioData.projects, fetchProjects]);

  if (loading) {
    return (
      <div className="project__container container grid" style={{ marginTop: "2rem" }}>
        {[1, 2, 3].map((n) => (
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
    );
  }

  return (
    <>
      <div className="project__container container grid" style={{ marginTop: "2rem" }}>
        {displayedProjects.map((project, index) => {
          return <ProjectItems item={project} key={project.id || index} />;
        })}
      </div>
      
      {(portfolioData.projects || []).length > 3 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2.5rem" }}>
          <button 
            className="button button--flex" 
            onClick={() => navigate("/projects")}
            style={{ display: "inline-flex", alignItems: "center", columnGap: "0.5rem", cursor: "pointer" }}
          >
            View All Projects <i className="uil uil-arrow-right" style={{ fontSize: "1.2rem" }}></i>
          </button>
        </div>
      )}
    </>
  );
}

export default Projects;