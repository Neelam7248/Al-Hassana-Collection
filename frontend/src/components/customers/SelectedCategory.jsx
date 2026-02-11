import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductContext } from "../admin/ProductManagement/ProductContext";
import { CartContext } from "./CartContext";
import "./Home.css";

const SelectedCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const {
    selectedCategoryProducts,
    handleCategorySelect,
    loading,
    error,
    page,
    setPage,
    limit,
  } = useContext(ProductContext);

  const {
    addToCart,
    cartItems,
    showPopup,
    increaseQty,
    decreaseQty,
    selectedSizes,
    selectedColors,
    updateSelectedSize,
    updateSelectedColor,
  } = useContext(CartContext);

  // Fetch products on category/page change
  useEffect(() => {
    if (category) {
      handleCategorySelect(category, page, limit);
    }
  }, [category, page]);

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [category]);

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
        <>
          <div className="product-grid">
            {selectedCategoryProducts.map((product) => {
              // Get unique sizes
              const sizes = [...new Set(product.variants.map((v) => v.size))];

              // Get colors for selected size
              const colors = product.variants
                ?.filter((v) => v.size === selectedSizes[product._id])
                .map((v) => v.color);

              // Find selected variant
              const selectedVariant = product.variants.find(
                (v) =>
                  v.size === selectedSizes[product._id] &&
                  v.color === selectedColors[product._id]
              );

              return (
                <div key={product._id} className="product-card">
                  {/* IMAGE */}
                  <img
                    src={product.images?.[0] || "/Imageplaceholder.png"}
                    alt={product.name}
                  />

                  {/* NAME */}
                  <h6 className="card-title">{product.name}</h6>

                  {/* PRICE */}
                  <p className="price">
                    <del>Rs {product.variants[0]?.realPrice}</del>{" "}
                    <ins>
                      Rs{" "}
                      {selectedVariant?.discountPrice ||
                        product.variants[0]?.discountPrice}
                    </ins>
                  </p>

                  {/* VARIANT SELECTORS */}
                  <div className="variant-selectors">
                    {/* SIZE SELECT */}
                    <select
                      value={selectedSizes[product._id] || ""}
                      onChange={(e) =>
                        updateSelectedSize(product._id, e.target.value)
                      }
                    >
                      <option value="">Select Size</option>
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size} (
                          {product.variants
                            .filter((v) => v.size === size)
                            .reduce((sum, v) => sum + Number(v.stock), 0)}{" "}
                          in stock)
                        </option>
                      ))}
                    </select>

                    {/* COLOR SELECT */}
                    <select
                      value={selectedColors[product._id] || ""}
                      onChange={(e) =>
                        updateSelectedColor(product._id, e.target.value)
                      }
                      disabled={!selectedSizes[product._id]}
                    >
                      <option value="">Select Color</option>
                      {colors?.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* BUTTONS */}
                  <div className="product-buttons">
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/productpage/${product._id}`)}
                    >
                      View
                    </button>

                    <button
                      className="btn-shop"
                      disabled={
                        !selectedSizes[product._id] ||
                        !selectedColors[product._id]
                      }
                      onClick={() =>
                        addToCart({
                          ...product,
                          selectedSize: selectedSizes[product._id],
                          selectedColor: selectedColors[product._id],
                        })
                      }
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <span>Page {page}</span>
            <button
              disabled={selectedCategoryProducts.length < limit}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* ADD TO CART POPUP */}
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

              <div className="cart-popup-buttons">
                <p>{latestItem.name}</p>
                <p>Size: {latestItem.selectedSize}</p>
                <p>Color: {latestItem.selectedColor}</p>
                <p>
                  Rs{" "}
                  {latestItem.selectedVariant?.discountPrice ||
                    latestItem.variants[0]?.discountPrice}
                </p>

                <div className="qty-box">
                  <button
                    className="qty-btn"
                    onClick={() =>
                      decreaseQty(
                        latestItem._id,
                        latestItem.selectedSize,
                        latestItem.selectedColor
                      )
                    }
                  >
                    -
                  </button>
                  <span className="qty-value">{latestItem.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() =>
                      increaseQty(
                        latestItem._id,
                        latestItem.selectedSize,
                        latestItem.selectedColor
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="cart-popup-buttons">
              <button
                onClick={() => navigate(`/productpage/${latestItem._id}`)}
              >
                View
              </button>
              <button onClick={() => navigate("/cartpage")}>Go to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(SelectedCategory);
