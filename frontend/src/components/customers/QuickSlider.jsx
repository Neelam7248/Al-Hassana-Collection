import React from "react";
import Slider from "react-slick";
import "./QuickSlider.css"; // slider-specific CSS

const QuickLinksSlider = ({ categories, handleCategorySelect }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 6,
    slidesToScroll: 1,
    swipeToSlide: true,
    variableWidth: false,
    outline:'none' , border:'none',width:"19px",gap:"19px",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 9 } },
      { breakpoint: 768, settings: { slidesToShow: 6 } },
      { breakpoint: 480, settings: { slidesToShow: 6 } }
    ]
  };

  return (
    <section className="home-quick-links-section">
      <Slider {...settings} className="buttons-slider">
        {categories.map((cat, index) => (
          <div key={index} className="quick-links"  >
            <button onClick={() => handleCategorySelect(cat)}>
              {cat}
            </button>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default QuickLinksSlider;
