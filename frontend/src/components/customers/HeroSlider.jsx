// src/components/customers/HeroSlider.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./HeroSlider.css";

const backendURL =
  process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";

function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/slides`);
        setSlides(res.data);

        // ✅ correct logging
        console.log(res.data, "slides data");
      } catch (err) {
        console.error("Failed to fetch slides:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (loading) return <p>Loading slides...</p>;
  if (!slides.length) return <p>No slides available</p>;

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
      {slides.map((slide) => {
        const isProduct = slide.link?.includes("/productdetailpage");
        const isCategory = slide.link?.includes("/category");

        // Extract slug if category
        let slug = "";
        if (isCategory) {
          slug = slide.link.split("/")[2]; // /category/oils → oils
        }

        return (
          <SwiperSlide key={slide._id}>
            <div
              className="hero-slide"
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
            >
              <div className="slide-content">
                <h5>{slide.title}</h5>
                {slide.subtitle && <p>{slide.subtitle}</p>}

                <button className={isProduct ? "button-shop" : "button"}                  onClick={() => {
                    if (isProduct) {
                      navigate(slide.link); // ✅ product page
                    } else if (isCategory && slug) {
                      navigate(`/selectedcategory/${slug}`); // ✅ selected category page
                    } else {
                      console.log("Invalid slide link:", slide);
                    }
                  }}
                >
                  {isProduct ? "Shop Now" : "View More"}
                </button>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

export default React.memo(HeroSlider);