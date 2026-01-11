import React, { useContext, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { ProductContext } from "../admin/ProductManagement/ProductContext";
import { CartContext } from "./CartContext";
import CartPage from "./CartPage";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./ProductDetailPage.css";

function ProductDetail() {
  const { id } = useParams();
  const { products, loading, error } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const product = products.find((p) => p._id === id);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const handleAddToCart=()=>{
    addToCart(product);
   setTimeout(()=>{
    navigate(-1);

   },1000);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-detail">

      {/* IMAGE SECTION */}
      <div className="image-wrapper">
        {product.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${product.name} ${index + 1}`}
            className="product-image"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setPhotoIndex(index);
              setIsOpen(true);
            }}
          />
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
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
      <h2 className="product-title">{product.name}</h2>
      <p className="product-description">{product.description}</p>
      <p className="product-price">
        <strong>Price:</strong> Rs. {product.discountPrice}
      </p>

      <button className="add-cart-btn" onClick={handleAddToCart}>

        Add To Cart
      </button>

      <CartPage />
    </div>
  );
}

export default React.memo(ProductDetail);
