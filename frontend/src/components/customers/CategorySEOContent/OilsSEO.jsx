import React from "react";

const OilsSEO = ({ categorySlug }) => {

  if (categorySlug === "rosemary-amla") {
    return (
      <div className="category-seo-content">
        <h2>Rosemary & Amla Hair Oil for Hair Growth</h2>

        <p>
          Rosemary and amla hair oil is a powerful herbal combination
          used to strengthen hair roots and improve scalp health.
        </p>

        <p>
          Regular use helps reduce hair fall, promote hair growth
          and add natural shine to the hair.
        </p>
      </div>
    );
  }

  if (categorySlug === "mixed-herbal-oils") {
    return (
      <div className="category-seo-content">
        <h2>Mixed Herbal Hair Oils</h2>

        <p>
          Mixed herbal hair oils combine several natural ingredients
          such as coconut oil, amla, castor oil and herbal extracts.
        </p>

        <p>
          These oils nourish the scalp, strengthen hair roots
          and improve overall hair texture naturally.
        </p>
      </div>
    );
  }

  if (categorySlug === "amla-oil") {
    return (
      <div className="category-seo-content">
        <h2>Pure Amla Hair Oil</h2>

        <p>
          Amla oil is one of the most popular traditional
          hair care oils used in Pakistan.
        </p>

        <p>
          Rich in antioxidants and vitamin C, amla oil
          strengthens hair roots, improves shine and
          helps maintain healthy hair.
        </p>
      </div>
    );
  }

  return null;
};

export default React.memo(OilsSEO);