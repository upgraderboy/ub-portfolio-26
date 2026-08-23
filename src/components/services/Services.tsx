import React, { useState } from "react";
import "./services.css";
import { usePortfolioData } from "../db/PortfolioContext";

const Services: React.FC = () => {
  const [toggleState, setToggleState] = useState(0);
  const { portfolioData } = usePortfolioData();
  const { services } = portfolioData;

  const toggleTab = (index: number) => {
    setToggleState(index);
  };

  return (
    <>
      <section className="services section" id="services">
        <h2 className="section__title">Services</h2>
        <span className="section__subtitle">What I offer</span>
        <div className="services__container container grid">
          {services.map((service, index) => {
            const tabIndex = index + 1;
            return (
              <div className="services__content" key={service.id}>
                <div>
                  <i className={`${service.icon} services__icon`}></i>
                  <h3 className="services__title" style={{ whiteSpace: "pre-line" }}>
                    {service.title}
                  </h3>
                </div>
                <span className="services__button" onClick={() => toggleTab(tabIndex)}>
                  View More
                  <i className="uil uil-arrow-right services__button-icon"></i>
                </span>
                <div
                  className={
                    toggleState === tabIndex ? "services__modal" : "services__modal-hidden"
                  }
                >
                  <div className="services__modal-content">
                    <i
                      className="uil uil-times services__modal-close"
                      onClick={() => setToggleState(0)}
                    ></i>
                    <h3 className="services__modal-title">{service.modalTitle}</h3>
                    <p className="services__modal-description">
                      {service.modalDescription}
                    </p>
                    <ul className="services__modal-services grid">
                      {service.points.map((point) => (
                        <li className="services__modal-service" key={point.id}>
                          <i className="uil uil-check-circle services__modal-icon"></i>
                          {point.link ? (
                            <a
                              href={point.link}
                              className="services__modal-info"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <u className="my__links">{point.text.split("=>")[0]?.trim()}</u> {point.text.includes("=>") ? "=>" : ""} {point.text.split("=>")[1]?.trim()}
                            </a>
                          ) : (
                            <p className="services__modal-info">{point.text}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Services;
