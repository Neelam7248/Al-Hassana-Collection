import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./HeroSlider.css";

const slides = [
  {
    image: "/slider1.jpg",
    title: "Premium Jackets Collection",
    subtitle: "Stylish & Comfortable",
    cta: "Shop Now",
    link: "/category/jackets",
  },
  {
    image: "/slider2.jpg",
    title: "New T-Shirts Arrival",
    subtitle: "Trendy & Affordable",
    cta: "Explore",
    link: "/category/t-shirts",
  },
  {
    image: "/slider3.jpg",
    title: "Exclusive Hoodies",
    subtitle: "Perfect for Every Season",
    cta: "View Collection",
    link: "/category/hoodies",
  },
];

function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div
            className="hero-slide"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-content">
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <a href={slide.link} className="btn-slide">
                {slide.cta}
              </a>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default HeroSlider;
