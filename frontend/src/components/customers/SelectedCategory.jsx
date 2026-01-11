import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductContext } from "../admin/ProductManagement/ProductContext";
import { CartContext } from "./CartContext";
import CartPage from "./CartPage";
import "./Home.css";

const SelectedCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const { selectedCategoryProducts, handleCategorySelect, loading, error } =
    useContext(ProductContext);

  const { addToCart, cartItems, showPopup, increaseQty, decreaseQty } =
    useContext(CartContext);

  useEffect(() => {
    if (category) handleCategorySelect(category);
  }, [category, handleCategorySelect]);

  const latestItem = cartItems[cartItems.length - 1];

  return (
    <div className="category-page-container">
      <h2 style={{ textTransform: "capitalize", marginBottom: "10px" }}>
        {category}
      </h2>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : selectedCategoryProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="product-grid">
          {selectedCategoryProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.images[0]} alt={product.name} />
              <h6>{product.name}</h6>
              <p className="product-price">
                <del style={{ color: "#8a0620" }}>{product.realPrice}</del>{" "}
                <ins style={{ color: "green" }}>
                  now Only <i>Rs {product.discountPrice}</i>
                </ins>
              </p>
              <div className="product-buttons">
                <button onClick={() => navigate(`/productpage/${product._id}`)}>
                  View
                </button>
                <button onClick={() => addToCart(product)} className="btn-view">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add-to-Cart Popup */}
      {showPopup && latestItem && (
        <div className="cart-popup-overlay">
          <div className="cart-popup">
            <h4>Added to Cart!</h4>
            <div className="cart-popup-item">
              <img
                src={latestItem.images?.[0] || "/Imageplaceholder.png"}
                alt={latestItem.name}
                width={100}
              />
              <div className="cart-popup-buttons button">
                <p>{latestItem.name}</p>
                <p>Rs {latestItem.discountPrice}</p>
                <div>
                  <button onClick={() => decreaseQty(latestItem._id)}>-</button>
                  <span>{latestItem.quantity}</span>
                  <button onClick={() => increaseQty(latestItem._id)}>+</button>
                </div>
              </div>
            </div>
            <div className="cart-popup-buttons">
              <button onClick={() => navigate(`/productpage/${latestItem._id}`)}>
                View
              </button>
              <button onClick={() => navigate("/cartpage")}>Go to Cart</button>
            </div>
          </div>
        </div>
      )}

      <CartPage />

      <footer>
        <p>© 2025 Denim Shop | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default React.memo(SelectedCategory);
