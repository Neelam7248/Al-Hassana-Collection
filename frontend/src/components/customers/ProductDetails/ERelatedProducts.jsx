// src/components/customers/ProductDetails/RelatedProducts.jsx
//Not in USe yet
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../CartContext";
import { useNavigate } from "react-router-dom";
import "../Home.css";

const backendURL = process.env.REACT_APP_API_BACKEND_URL;

const RelatedProducts = ({ categorySlug, currentProductId = null }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const {
    addToCart,
    selectedSizes,
    selectedColors,
    updateSelectedSize,
    updateSelectedColor
  } = useContext(CartContext);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categorySlug) return;

      setLoading(true);
      setError(null);

      try {
        // Backend should return all products in this category AND all its subcategories
        const res = await axios.get(`${backendURL}/api/products/byCategory`, {
          params: {
            subCategory: categorySlug,
            includeSubCategories: true, // 🔹 important!
            limit: 20, // or any number you want to display
          },
        });

        // Exclude current product if provided
        const filtered = res.data.filter(p => p._id !== currentProductId);

        setRelatedProducts(filtered.map(p => ({ ...p, images: p.images || [] })));
      } catch (err) {
        console.error("Failed to fetch related products", err);
        setError("Failed to load related products");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categorySlug, currentProductId]);

  if (loading) return <p>Loading related products...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (relatedProducts.length === 0) return <p>No related products found.</p>;

  return (
    <div className="related-products-container">
      <h4>Related Products</h4>
      <div className="product-grid">
        {relatedProducts.map(product => {
          const sizes = [...new Set(product.variants.map(v => v.size))];
          const colors = product.variants
            .filter(v => v.size === selectedSizes[product._id])
            .map(v => v.color);

          const selectedVariant = product.variants.find(
            v =>
              v.size === selectedSizes[product._id] &&
              v.color === selectedColors[product._id]
          );

          return (
            <div key={product._id} className="product-card">
              <img
                src={product.images?.[0] || "/Imageplaceholder.png"}
                alt={product.name}
              />
              <h6 className="card-title">{product.name}</h6>
              <p className="price">
                <del>Rs {product.variants[0]?.realPrice}</del>{" "}
                <ins>{selectedVariant?.discountPrice || product.variants[0]?.discountPrice}</ins>
              </p>

              {/* SIZE SELECT */}
              <select
                value={selectedSizes[product._id] || ""}
                onChange={e => updateSelectedSize(product._id, e.target.value)}
              >
                <option value="">Select Size</option>
                {sizes.map(size => (
                  <option key={size} value={size}>
                    {size} (
                    {product.variants
                      .filter(v => v.size === size)
                      .reduce((sum, v) => sum + Number(v.stock), 0)} in stock)
                  </option>
                ))}
              </select>

              {/* COLOR SELECT */}
              <select
                value={selectedColors[product._id] || ""}
                onChange={e => updateSelectedColor(product._id, e.target.value)}
                disabled={!selectedSizes[product._id]}
              >
                <option value="">Select Color</option>
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>

              <div className="product-buttons">
                <button
                  className="btn-view"
                  onClick={() => navigate(`/productdetailpage/${product._id}`)}
                >
                  View
                </button>
                <button
                  className="btn-shop"
                  disabled={!selectedSizes[product._id] || !selectedColors[product._id]}
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
    </div>
  );
};

export default React.memo(RelatedProducts);