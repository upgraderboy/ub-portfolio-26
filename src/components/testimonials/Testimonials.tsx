import React from "react";
import "./testimonials.css";
import { usePortfolioData } from "../db/PortfolioContext";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import required modules
import { Navigation, Pagination, Keyboard } from "swiper/modules";

interface Testimonial {
  id: string;
  image: string;
  title: string;
  description: string;
}

const Testimonials: React.FC = () => {
  const { portfolioData } = usePortfolioData();
  const { testimonials } = portfolioData;

  return (
    <>
      <section className="testimonial container section" id="testimonial">
        <h2 className="section__title">My Clients Say</h2>
        <span className="section__subtitle">Testimonials</span>
        {testimonials.length > 0 ? (
          <Swiper
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            spaceBetween={24}
            modules={[Navigation, Pagination, Keyboard]}
            grabCursor={true}
            loop={testimonials.length > 1}
            breakpoints={{
              350: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: Math.min(2, testimonials.length),
              },
              1024: {
                slidesPerView: Math.min(3, testimonials.length),
              },
            }}
            keyboard={true}
            className="mySwiper testimonial__container"
          >
            {testimonials.map(({ id, image, title, description }: Testimonial) => (
              <SwiperSlide className="testimonial__card" key={id}>
                {/* Cyber corners */}
                <div className="testimonial__card-corner testimonial__card-corner--tl"></div>
                <div className="testimonial__card-corner testimonial__card-corner--tr"></div>
                <div className="testimonial__card-corner testimonial__card-corner--bl"></div>
                <div className="testimonial__card-corner testimonial__card-corner--br"></div>

                {/* Decorative quote icon */}
                <i className="uil uil-quote-right testimonial__quote-icon"></i>

                <div className="testimonial__client-info">
                  <img src={image} alt={title} className="testimonial__img" />
                  <div>
                    <h3 className="testimonial__name">{title}</h3>
                    <div className="testimonial__stars">
                      <i className="uil uil-star"></i>
                      <i className="uil uil-star"></i>
                      <i className="uil uil-star"></i>
                      <i className="uil uil-star"></i>
                      <i className="uil uil-star"></i>
                    </div>
                  </div>
                </div>
                
                <p className="testimonial__description">{description}</p>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p style={{ textAlign: "center", color: "var(--font-color)" }}>No testimonials available yet.</p>
        )}
      </section>
    </>
  );
};

export default Testimonials;