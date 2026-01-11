// src/components/CartPopup.jsx
import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
import "./CartPopup.css";

const CartPopup = () => {
  const { showPopup, cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  if (!showPopup || cartItems.length === 0) return null;

  // Show the latest added product
  const latestItem = cartItems[cartItems.length - 1];

  return (
    <div className="cart-popup-overlay">
      <div className="cart-popup">
        <h4>Added to Cart!</h4>
        <div className="cart-popup-item">
          <img
            src={latestItem.images?.[0] || "/placeholder.png"}
            alt={latestItem.name}
          />
          <div className="d-flex align-items-center mb-2">
                      <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={() => decreaseQty(item._id)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm ms-2"
                        onClick={() => increaseQty(item._id)}
                      >
                        +
                      </button>
                    </div>
          <div>
            <p>{latestItem.name}</p>
            <p>Rs {latestItem.price}</p>
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
