import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import "./ProductPage.css";
import { ProductContext } from "../admin/ProductManagement/ProductContext";
import { CartContext } from "./CartContext";

const ProductPage = () => {
  const { id } = useParams();
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);

  // States for selected size & color
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const product = products.find((p) => p._id === id);

  const [previewImage, setPreviewImage] = useState("");

  if (!product) {
    return (
      <p style={{ textAlign: "center", marginTop: "40px" }}>
        Product Not Found.
      </p>
    );
  }

  // Filter variants for selected size
  const availableColors = product.variants
    ?.filter((v) => v.size === selectedSize)
    .map((v) => v.color);

  // Get price of selected variant
  const selectedVariant =
    product.variants?.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    ) || product.variants?.[0];

  return (
    <div className="product-detail-container">

      {/* ======= MAIN IMAGE ======= */}
      <div className="main-image-wrapper">
        <InnerImageZoom
          src={previewImage || product.images[0]}
          zoomSrc={previewImage || product.images[0]}
          zoomType="hover"
          fullscreenOnMobile={true}
          zoomScale={2}
          className="product-image"
        />
      </div>

      {/* ======= THUMBNAIL IMAGES ======= */}
      <div className="thumbnail-wrapper">
        {product.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`thumb-${index}`}
            className={`thumbnail-image ${previewImage === img ? "active" : ""}`}
            onClick={() => setPreviewImage(img)}
          />
        ))}
      </div>

      {/* ======= PRODUCT INFORMATION ======= */}
      <div className="product-info">
        <h2>{product.name}</h2>

        <p className="product-page price-section">
          <del style={{ color: "#a00" }}>Rs {selectedVariant?.realPrice ?? "N/A"}</del>
          <ins style={{ color: "green", marginLeft: "6px" }}>
            Rs {selectedVariant?.discountPrice ?? "N/A"}
          </ins>
        </p>

        <p className="product-page description">{product.description}</p>

        {/* SIZE SELECT */}
        <select
          value={selectedSize}
          onChange={(e) => {
            setSelectedSize(e.target.value);
            setSelectedColor(""); // reset color when size changes
          }}
        >
          <option value="">Select Size</option>
          {product.variants?.map((v) => (
            <option key={v.size} value={v.size}>
              {v.size} ({v.stock} in stock)
            </option>
          ))}
        </select>

        {/* COLOR SELECT */}
        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          disabled={!selectedSize}
        >
          <option value="">Select Color</option>
          {availableColors?.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>

        <button
          className="add-btn"
          onClick={() => {
            if (!selectedSize || !selectedColor) {
              alert("Please select size and color first!");
              return;
            }
            addToCart(product, selectedSize, selectedColor);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProductPage);
