import { usePortfolioData } from "../db/PortfolioContext";

function Backend() {
  const { portfolioData } = usePortfolioData();
  const { skills } = portfolioData;
  const backendSkills = skills.backend;

  const midIndex = Math.ceil(backendSkills.length / 2);
  const col1 = backendSkills.slice(0, midIndex);
  const col2 = backendSkills.slice(midIndex);

  return (
    <>
      <div className="skills__content">
        <h3 className="skills__title">Backend developer</h3>

        <div className="skills__box">
          <div className="skills__group">
            {col1.map((skill, index) => (
              <div className="skills__data" key={index}>
                <i className="bx bx-badge-check"></i>
                <div>
                  <h3 className="skills__name">{skill.name}</h3>
                  <span className="skills__level">{skill.level}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="skills__group">
            {col2.map((skill, index) => (
              <div className="skills__data" key={index}>
                <i className="bx bx-badge-check"></i>
                <div>
                  <h3 className="skills__name">{skill.name}</h3>
                  <span className="skills__level">{skill.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Backend;