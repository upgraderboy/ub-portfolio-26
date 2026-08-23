import React from "react";
import Projects from "./Projects.tsx";
import "./project.css";

interface ProjectProps {
  navigate: (to: string) => void;
}

const Project: React.FC<ProjectProps> = ({ navigate }) => {
  return (
    <>
      <section className="work section" id="portfolio">
        <h2 className="section__title">Portfolio</h2>
        <span className="section__subtitle">Most Recent Works</span>
        <Projects navigate={navigate} />
      </section>
    </>
  );
};

export default Project;
