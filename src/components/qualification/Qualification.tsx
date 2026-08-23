import { useState } from "react";
import "./qualification.css";
import { usePortfolioData } from "../db/PortfolioContext";

const Qualification: React.FC = () => {
  const [toggleState, setToggleState] = useState(1);
  const { portfolioData } = usePortfolioData();
  const { qualification } = portfolioData;

  const toggleTab = (index: number) => {
    setToggleState(index);
  };

  const renderTimeline = (items: typeof qualification.education) => {
    return items.map((item, index) => {
      const isEven = index % 2 === 0;
      return (
        <div className="qualification__data" key={item.id}>
          {isEven ? (
            <>
              <div>
                <h3 className="qualification__title">{item.title}</h3>
                <span className="qualification__subtitle">{item.subtitle}</span>
                <div className="qualification__calender">
                  <i className="uil uil-calendar-alt"></i> {item.calendar}
                </div>
              </div>
              <div>
                <span className="qualification__rounder"></span>
                {index < items.length - 1 && <span className="qualification__line"></span>}
              </div>
              <div></div>
            </>
          ) : (
            <>
              <div></div>
              <div>
                <span className="qualification__rounder"></span>
                {index < items.length - 1 && <span className="qualification__line"></span>}
              </div>
              <div>
                <h3 className="qualification__title">{item.title}</h3>
                <span className="qualification__subtitle">{item.subtitle}</span>
                <div className="qualification__calender">
                  <i className="uil uil-calendar-alt"></i> {item.calendar}
                </div>
              </div>
            </>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <section className="qualification section" id="qualification">
        <h2 className="section__title">Qualification</h2>
        <span className="section__subtitle">My Personal Journey</span>

        <div className="qualification__container container">
          <div className="qualification__tabs">
            <div
              className={
                toggleState === 1
                  ? "qualification__active qualification__button button--flex"
                  : "qualification__button button--flex"
              }
              onClick={() => toggleTab(1)}
            >
              <i className="uil uil-graduation-cap qualification__icon"></i>
              Education
            </div>
            <div
              className={
                toggleState === 2
                  ? "qualification__active qualification__button button--flex"
                  : "qualification__button button--flex"
              }
              onClick={() => toggleTab(2)}
            >
              <i className="uil uil-briefcase-alt qualification__icon"></i>
              Experience
            </div>
          </div>
        </div>

        <div className="qualification__sections">
          <div
            className={
              toggleState === 1
                ? "qualification__content qualification__content-active"
                : "qualification__content"
            }
          >
            {renderTimeline(qualification.education)}
          </div>

          <div
            className={
              toggleState === 2
                ? "qualification__content qualification__content-active"
                : "qualification__content"
            }
          >
            {renderTimeline(qualification.experience)}
          </div>
        </div>
      </section>
    </>
  );
};

export default Qualification;
