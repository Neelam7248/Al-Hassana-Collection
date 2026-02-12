// src/components/CartPopup.jsx
import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
import "./CartPopup.css";

const CartPopup = () => {
  const { showPopup, cartItems, decreaseQty, increaseQty } = useContext(CartContext);
  const navigate = useNavigate();

  if (!showPopup || cartItems.length === 0) return null;

  // Show the latest added product
  const latestItem = cartItems[cartItems.length - 1];

  // Find the selected variant
  const selectedVariant = latestItem.variants.find(
    (v) =>
      v.size === latestItem.selectedSize &&
      v.color === latestItem.selectedColor
  ) || latestItem.variants[0]; // fallback to first variant if none selected

  return (
    <div className="cart-popup-overlay">
      <div className="cart-popup">
        <h4>Added to Cart!</h4>
        <div className="cart-popup-item">
          <img
            src={latestItem.images?.[0] || "/placeholder.png"}
            alt={latestItem.name}
          /><br/>

          <div className="d-flex align-items-center mb-2">
            <button
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={() => decreaseQty(latestItem._id, selectedVariant.key)}
            >
              -
            </button>
            <span>{latestItem.quantity}</span>
            <button
              className="btn btn-outline-secondary btn-sm ms-2"
              onClick={() => increaseQty(latestItem._id, selectedVariant.key)}
            >
              +
            </button>
          </div>

          <div className="cart-popup-details">
            <p><strong>Size:</strong> {selectedVariant.size || "N/A"}</p>
            <p><strong>Color:</strong> {selectedVariant.color || "N/A"}</p>
            <p><strong>Price:</strong> Rs {selectedVariant.discountPrice}</p>
            {selectedVariant.realPrice && selectedVariant.realPrice !== selectedVariant.discountPrice && (
              <p className="text-muted"><del>Rs {selectedVariant.realPrice}</del></p>
            )}
          </div>
        </div>

        <div className="cart-popup-buttons">
          <button onClick={() => navigate(`/productpage/${latestItem._id}`)}>
            View
          </button>
          <button onClick={() => navigate("/cart")}>Go to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CartPopup);
