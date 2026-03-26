import React from "react";

const HajjUmrahSEO = ({ categorySlug }) => {

  if (categorySlug === "ehram-men") {
    return (
      <div className="category-seo-content">
        <h2>Ehram for Men – Hajj & Umrah Essential</h2>
        <p>
          Ihram clothing is an essential requirement for
          pilgrims performing Hajj and Umrah.
        </p>
        <p>
          Comfortable cotton ihram helps pilgrims perform
          rituals with ease during their spiritual journey.
        </p>
      </div>
    );
  }

  if (categorySlug === "tasbeeh") {
    return (
      <div className="category-seo-content">
        <h2>Tasbeeh Prayer Beads</h2>
        <p>
          Tasbeeh beads are commonly used by Muslims
          for dhikr and remembrance of Allah.
        </p>
        <p>
          Tasbeeh are available in wooden, digital
          and stone varieties for daily use.
        </p>
      </div>
    );
  }

  if (categorySlug === "jaenamaz") {
    return (
      <div className="category-seo-content">
        <h2>Jaenamaz – Islamic Prayer Mat</h2>
        <p>
          Jaenamaz or prayer mats are essential for
          daily prayers and provide comfort during salah.
        </p>
        <p>
          Many people prefer lightweight and portable
          prayer mats for travel and Umrah journeys.
        </p>
      </div>
    );
  }

  return null;
};

export default React.memo(HajjUmrahSEO);