// QuickSlider.jsx
import React from "react";
import Slider from "react-slick";
import { categoriesConfig } from "../../config/CategoriesConfig";
import "./QuickSlider.css";

const commonSliderSettings = {
  dots: false,
  infinite: false,
  arrows: false,
  speed: 400,
  slidesToShow: 6,
  slidesToScroll: 1,
  swipeToSlide: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 5 } },
    { breakpoint: 768, settings: { slidesToShow: 4 } },
    { breakpoint: 480, settings: { slidesToShow: 2.5 } },
  ],
};

const QuickLinksSlider = ({ onSubCategoryClick }) => {
  const allCategories = Object.values(categoriesConfig);

  return (
    <section className="sg-quick-links">
      {allCategories.map((cat) => {
        const subCategs = cat.subCategories
          ? Object.values(cat.subCategories)
          : [];

        if (subCategs.length === 0) return null;

        return (
          <div key={cat.slug} className="sg-category-row">
            <h3 className="sg-category-title">{cat.label}</h3>

            <Slider {...commonSliderSettings}>
              {subCategs.map((sub) => (
                <div key={sub.slug} className="sg-slide">
                  <div
                    className="sg-card"
                    onClick={() =>
                      onSubCategoryClick(cat.slug, sub.slug)
                    }
                  >
                    {/* Optional icon / image */}
                    <div className="sg-icon">
                      <img
                        src={sub.icon || "/category-placeholder.png"}
                        alt={sub.label}
                      />
                    </div>

                    <p className="sg-label">{sub.label}</p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        );
      })}
    </section>
  );
};

export default QuickLinksSlider;
//i am not currently using it in my wesite