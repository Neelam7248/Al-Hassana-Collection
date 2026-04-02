import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ProductContext } from "../admin/ProductManagement/ProductContext";
import { CartContext } from "./CartContext";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./ProductDetailPage.css";
import DescriptionTabs from "./ProductDetails/DescriptionTabs";
import FrequentlyBoughtTogether from "./ProductDetails/FrequentlyBoughtTogether";
import ProductGallery from "./ProductDetails/ProductGallery";
import ProductReviews from "./ProductDetails/ProductReview";
import useSEO from "../../hooks/useSEO"; 
import { generateKeywordsForCategory } from "../../utils/SEOkeywords";
import { categoriesConfig } from "../../config/CategoriesConfig";

function ProductDetail() {
  const { id } = useParams();
  const { products, loading, error } = useContext(ProductContext);
  const {
    addToCart,
    selectedSizes,
    selectedColors,
    updateSelectedSize,
    updateSelectedColor,
    cartButtonVisible,
  } = useContext(CartContext);

  const location = useLocation();
  const navigate = useNavigate();
  const product = products.find((p) => p._id === id);

  // Default variant select on page load
  useEffect(() => {
    if (!product) return;
    if (!selectedSizes[product._id]) {
      updateSelectedSize(product._id, product.variants[0].size);
      updateSelectedColor(product._id, product.variants[0].color);
    }
  }, [product]);

  // SEO keywords
  const keywordsBySubCategory = generateKeywordsForCategory(categoriesConfig);
  const productKeywords = product
    ? `${product.name}, ${keywordsBySubCategory[product.subCategory] || ""}`
    : "";

  useSEO({
    title: product ? `${product.name} - Al-Hassana Collections` : "Al-Hassana Collections",
    description: product?.description || "Premium product from Al-Hassana Collections",
    keywords: productKeywords,
    image: product?.images[0],
    url: `https://alhassanacollections.com${location.pathname}`,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [qty, setQty] = useState(1);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Product not found</p>;

  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const availableColors = product.variants
    ?.filter((v) => v.size === selectedSizes[product._id])
    .map((v) => v.color);

  const selectedVariant = product.variants.find(
    (v) =>
      v.size === selectedSizes[product._id] &&
      v.color === selectedColors[product._id]
  ) || product.variants[0];

  // JSON-LD object
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description || "",
    sku: product._id,
    brand: { "@type": "Brand", name: "Al-Hassana Collections" },
    offers: {
      "@type": "Offer",
      url: `https://alhassanacollections.com${location.pathname}`,
      priceCurrency: "PKR",
      price: selectedVariant.discountPrice,
      availability:
        selectedVariant.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating:
      product.reviews?.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating || "5",
            reviewCount: product.reviews.length,
          }
        : undefined,
    review:
      product.reviews?.length > 0
        ? product.reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.userName },
            datePublished: r.date,
            reviewBody: r.comment,
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: "5",
            },
          }))
        : undefined,
  };

  const handleAddToCart = () => {
    if (!selectedSizes[product._id] || !selectedColors[product._id]) {
      alert("Please select size and color first!");
      return;
    }
    addToCart(product, qty);
    alert("Added to cart!");
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div className="product-detail">
      <div className="product-main">
        {/* IMAGE */}
        <div className="image-wrapper">
          {product.images.length > 0 && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="product-main-image"
              onClick={() => {
                setPhotoIndex(0);
                setIsOpen(true);
              }}
            />
          )}
          {product.images.length > 1 && (
            <div className="thumbnail-wrapper">
              {product.images.slice(1).map((img, idx) => (
                <img
                  key={idx + 1}
                  src={img}
                  alt={`${product.name} ${idx + 2}`}
                  className="product-thumbnail"
                  onClick={() => {
                    setPhotoIndex(idx + 1);
                    setIsOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* LIGHTBOX */}
        {isOpen && (
          <Lightbox
            open={isOpen}
            close={() => setIsOpen(false)}
            slides={product.images.map((url) => ({ src: url }))}
            index={photoIndex}
            controller={{ closeOnBackdropClick: true }}
          />
        )}

        {/* PRODUCT INFO */}
        <div className="product-info">
          <h3 className="product-title">{product.name}</h3>
          <DescriptionTabs product={product} />

          <div className="parent-selector">
            <h5>Quantity:</h5>
            <div className="quantity-selector">
              <button onClick={() => setQty((prev) => Math.max(1, prev - 1))}>
                -
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((prev) => prev + 1)}>+</button>
            </div>

            <h5>Price:</h5>
            <p className="product-price">
              <del>Rs {selectedVariant.realPrice}</del>
              <ins>Rs {selectedVariant.discountPrice}</ins>
            </p>
          </div>

          {/* SIZE SELECT */}
          <select
            value={selectedSizes[product._id] || ""}
            onChange={(e) => {
              updateSelectedSize(product._id, e.target.value);
              updateSelectedColor(product._id, "");
            }}
          >
            <option value="">Select Size</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size} (
                {product.variants
                  .filter((v) => v.size === size)
                  .reduce((sum, v) => sum + Number(v.stock), 0)} in stock)
              </option>
            ))}
          </select>

          {/* COLOR SELECT */}
          <select
            value={selectedColors[product._id] || ""}
            onChange={(e) => updateSelectedColor(product._id, e.target.value)}
            disabled={!selectedSizes[product._id]}
          >
            <option value="">Select Color</option>
            {availableColors?.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>

          <button className="add-cart-btn" onClick={handleAddToCart}>
            Add To Cart
          </button>
        </div>
      </div>

      <ProductGallery
        images={product.images}
        setPhotoIndex={setPhotoIndex}
        setIsOpen={setIsOpen}
      />
      <FrequentlyBoughtTogether
        productId={product._id}
        addToCart={addToCart}
        photoIndex={photoIndex}
        setPhotoIndex={setPhotoIndex}
        setIsOpen={setIsOpen}
        product={product}
        cartButtonVisible={cartButtonVisible}
      />
      <ProductReviews reviews={product.reviews} productId={product._id} />

      {/* JSON-LD script for SEO */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </div>
  );
}

export default React.memo(ProductDetail);