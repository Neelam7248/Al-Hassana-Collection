import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

function CartPage() {
  const {
    cartItems,
    increaseQty,
    incompleteItems,
    totalItems,
    canCheckout,
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
 <div className="cart-summary">
  <p>Total Items In your cart are: {totalItems}</p>
            <h3>Total: Rs {totalPrice}</h3>
            <button
              className="checkout-btn"
              onClick={() => {
                if (cartItems.length === 0) return;
                if (!canCheckout) {
                  alert("Please select size and color for all items before checkout.");
                  return;
                }

                
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
          <div>Below is the list of items in your cart</div>

      {cartItems.length === 0 ? (
        <p className="empty-text">Your cart is empty.</p>
      ) : (
        <div className="cart-container">
          {/* CART ITEMS */}
          <div className="cart-items">
            {cartItems.map((item, index) => {
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
                  
                  <div className="cart-page ">
                    {/* IMAGE */}
                    <img
                      src={
                        item.images?.[0].startsWith("http") ||
                        item.images?.[0].startsWith("/uploads")
                          ? item.images[0]
                          : `/uploads/${item.images?.[0]}`
                      }
                      alt={item.name}
                      className="cart-page-img"
                    />

                    {/* DETAILS */}
                    <div className="cart-item-details">
                      <h4 className="card-title">{index + 1}. {item.name}</h4>

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
                        <button onClick={() => decreaseQty(item._id,item.variantKey)} className="qty-btn">-</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button onClick={() => increaseQty(item._id,item.variantKey  )} className="qty-btn">+</button>
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
                            removeFromCart(item._id,item.variantKey);
                          }
                        }}
                      >
                        Remove
                      </button>
                      <p className="cart-note">✨ Please see above the grandTotal of your cart.</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CART SUMMARY */}
                 </div>
      )}
    </div>
  );
}

export default React.memo(CartPage);
