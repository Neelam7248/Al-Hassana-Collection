import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

function CartPage() {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    totalPrice,
    clearCart,
    buyNowAll,
    updateSelectedSize,
    updateSelectedColor,
  } = useContext(CartContext);

  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-text">Your cart is empty.</p>
      ) : (
        <div className="cart-container">
          {/* CART ITEMS */}
          <div className="cart-items">
            {cartItems.map((item) => {
              const sizes = [...new Set(item.variants.map(v => v.size))];
              const colors = item.variants
                ?.filter(v => v.size === item.selectedSize)
                .map(v => v.color);

              const selectedVariant = item.variants.find(
                v =>
                  v.size === item.selectedSize &&
                  v.color === item.selectedColor
              );

              return (
                <div key={item._id + item.selectedSize + item.selectedColor} className="product-card-container">
                  <div className="cart-page product-card">
                    {/* IMAGE */}
                    <img
                      src={
                        item.images?.[0].startsWith("http") ||
                        item.images?.[0].startsWith("/uploads")
                          ? item.images[0]
                          : `/uploads/${item.images?.[0]}`
                      }
                      alt={item.name}
                      className="cart-item-img"
                    />

                    {/* DETAILS */}
                    <div className="cart-item-details">
                      <h4 className="card-title">{item.name}</h4>

                      {/* PRICE */}
                      <p className="price">
                        Rs {selectedVariant?.discountPrice || item.variants[0]?.discountPrice}
                      </p>

                      {/* SIZE SELECT */}
                      <div className="select-box">
                        <label>Size:</label>
                        <select
                          value={item.selectedSize || ""}
                          onChange={(e) =>
                            updateSelectedSize(item._id, e.target.value)
                          }
                        >
                          <option value="">Select Size</option>
                          {sizes.map((size) => (
                            <option
                              key={size}
                              value={size}
                              disabled={item.variants
                                .filter((v) => v.size === size)
                                .reduce((sum, v) => sum + Number(v.stock), 0) <= 0}
                            >
                              {size} (
                              {item.variants
                                .filter((v) => v.size === size)
                                .reduce((sum, v) => sum + Number(v.stock), 0)} in stock)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* COLOR SELECT */}
                      <div className="select-box">
                        <label>Color:</label>
                        <select
                          value={item.selectedColor || ""}
                          onChange={(e) =>
                            updateSelectedColor(item._id, e.target.value)
                          }
                          disabled={!item.selectedSize}
                        >
                          <option value="">Select Color</option>
                          {colors?.map((color) => (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* QUANTITY */}
                      <div className="qty-box">
                        <button onClick={() => decreaseQty(item._id)} className="qty-btn">-</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button onClick={() => increaseQty(item._id)} className="qty-btn">+</button>
                      </div>

                      {/* SUBTOTAL */}
                      <p className="subtotal">
                        Subtotal: Rs {(selectedVariant?.discountPrice || item.variants[0]?.discountPrice) * item.quantity}
                      </p>

                      {/* REMOVE */}
                      <button
                        className="remove-btn"
                        onClick={() => {
                          if (window.confirm("Remove this item?")) {
                            removeFromCart(item._id);
                          }
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CART SUMMARY */}
          <div className="cart-summary">
            <h3>Total: Rs {totalPrice}</h3>
            <button
              className="checkout-btn"
              onClick={() => {
                if (cartItems.length === 0) return;
                buyNowAll();
              }}
            >
              Buy Now
            </button>
            <button
              className="clear-btn"
              onClick={() => {
                if (window.confirm("Clear entire cart?")) clearCart();
              }}
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(CartPage);
