import React, { useContext, useEffect, useState } from "react";
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

  const product = products.find((p) => p._id === id);

  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  if (!product) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Product Not Found.</p>;
  }

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

    <p className="price-section">
      <del style={{ color: "#a00" }}>Rs 10000</del>
      <ins style={{ color: "green", marginLeft: "6px" }}>
        Rs {product.discountPrice}
      </ins>
    </p>

    <p className="description">{product.description}</p>

    <button className="add-btn" onClick={() => addToCart(product)}>
      Add to Cart
    </button>
  </div>

  {/* ======= MODAL IMAGE PREVIEW ======= */}
  {showPreview && (
    <div
      className="preview-overlay"
      onClick={() => setShowPreview(false)}
    >
      <div className="preview-box" onClick={(e) => e.stopPropagation()}>
        <img src={previewImage} alt="preview" className="preview-img" />
      </div>
    </div>
  )}
</div>
  );
};

export default React.memo(ProductPage) ;
