import React from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import DefaultHomeImg from "../../assets/UB.png";
import "./home.css";
import Social from "./Social";
import Data from "./Data";
import ScrollDown from "./ScrollDown";

const Home: React.FC = () => {
  const { portfolioData } = usePortfolioData();
  const homeImg = portfolioData.home.imageUrl || DefaultHomeImg;

  return (
    <>
      <section className="home section" id="home">
        <div className="home__container container grid">
          <div className="home__content grid">
            <Social />
            <div className="home__img" style={{ backgroundImage: `url(${homeImg})` }}></div>
            <Data />
          </div>
          <ScrollDown />
        </div>
      </section>
    </>
  );
};

export default Home;