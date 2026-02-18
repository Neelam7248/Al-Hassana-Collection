import React from "react";
import "./ProductGallery.css";

const ProductGallery = ({ images, setPhotoIndex, setIsOpen }) => {
  return (
    <div className="product-gallery">
      {images && images.length > 0 ? (
        images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Product Image ${idx + 1}`}
            className="gallery-thumbnail"
            onClick={() => {
              setPhotoIndex(idx);
              setIsOpen(true);
            }}
          />
        ))
      ) : (
        <p>No images available</p>
      )}
    </div>
  );
};

export default ProductGallery;
