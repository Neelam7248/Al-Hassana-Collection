import React from "react";

const FragrancesSEO = ({ categorySlug }) => {

  if (categorySlug === "fresh-cool") {
    return (
      <div className="category-seo-content">
        <h2>Fresh & Cool Perfumes for Summer</h2>

        <p>
          Fresh and cool perfumes are perfect for hot weather in Pakistan.
          Citrus and aqua fragrances provide a refreshing scent that works
          well for daily wear and office environments.
        </p>

        <p>
          Many men prefer light perfumes for daytime use because they are
          not overpowering and stay comfortable throughout the day.
          Fresh perfumes are especially popular during summer months.
        </p>
      </div>
    );
  }

  if (categorySlug === "floral") {
    return (
      <div className="category-seo-content">
        <h2>Floral Perfumes for Women</h2>

        <p>
          Floral perfumes are among the most loved fragrances for women.
          Popular notes include rose, jasmine and sweet floral blends
          that create an elegant and feminine scent.
        </p>

        <p>
          These perfumes are perfect for daily wear, special events
          and weddings. Floral fragrances provide a soft and romantic
          aroma that lasts throughout the day.
        </p>
      </div>
    );
  }

  if (categorySlug === "attar-oil-perfumes") {
    return (
      <div className="category-seo-content">
        <h2>Natural Attar Oil Perfumes</h2>

        <p>
          Attar perfumes are traditional alcohol-free fragrances
          widely used in Pakistan and the Middle East. These oils
          provide a strong and long-lasting scent.
        </p>

        <p>
          Arabic attars often include notes like oud, musk,
          sandalwood and rose. Because they are oil based,
          they last longer on the skin compared to spray perfumes.
        </p>
      </div>
    );
  }

  if (categorySlug === "bakhoor") {
    return (
      <div className="category-seo-content">
        <h2>Premium Bakhoor & Home Fragrance</h2>

        <p>
          Bakhoor is a traditional incense used in many homes
          across the Middle East and South Asia. When burned,
          it releases a rich aromatic fragrance.
        </p>

        <p>
          Bakhoor is commonly used during gatherings,
          special occasions and religious events to create
          a welcoming and luxurious environment.
        </p>
      </div>
    );
  }

  return null;
};

export default React.memo(FragrancesSEO);