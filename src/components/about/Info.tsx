import { usePortfolioData } from "../db/PortfolioContext";

function Info() {
  const { portfolioData } = usePortfolioData();
  const { about } = portfolioData;

  return (
    <>
      <div className="about__info grid">
        <div className="about__box">
          <i className="bx bx-award about__icon"></i>
          <h3 className="about__title">Experience</h3>
          <span className="about__subtitle">{about.experienceYears}</span>
        </div>
        <div className="about__box">
          <i className="bx bx-briefcase-alt about__icon"></i>
          <h3 className="about__title">Completed</h3>
          <span className="about__subtitle">{about.completedProjects}</span>
        </div>
        <div className="about__box">
          <i className="bx bx-support about__icon"></i>
          <h3 className="about__title">Support</h3>
          <span className="about__subtitle">{about.supportAvailability}</span>
        </div>
      </div>
    </>
  );
}

export default Info;
