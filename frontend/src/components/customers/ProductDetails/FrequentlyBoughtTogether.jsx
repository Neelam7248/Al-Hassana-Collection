import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FrequentlyBoughtTogether.css";

function FrequentlyBoughtTogether({
  productId,
  product,
  cartButtonVisible,
  setPhotoIndex,
  photoIndex,
  setIsOpen
}) {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);

  const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";
  const navigate = useNavigate();

  // ✅ Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/products/frequently-bought/${productId.trim()}`);
        console.log("Frequently Bought Together response:", res.data);
        setProducts(res.data.relatedProducts || []);
      } catch (err) {
        console.error("Failed to fetch frequently bought together products:", err);
      }
    };
    if (productId) fetchRelatedProducts();
  }, [productId]);

  // ✅ Toggle select/deselect product
  const toggleSelect = (p) => {
    setSelectedProducts(prev => {
      if (prev.find(sp => sp._id === p._id)) {
        return prev.filter(sp => sp._id !== p._id);
      } else {
        return [...prev, p];
      }
    });
  };

  // ✅ Add all selected products + main product to cart
  const handleAddAllToCart = () => {
    if (!product) return alert("Main product not loaded yet");

    const allProducts = [...selectedProducts, product];
    allProducts.forEach(p => addToCart(p));

    setAddedToCart(true);
    alert("Selected products are added to cart!");
  };

  if (!products.length) {
    return (
      <div className="frequently-bought-together">
        <h3>Frequently Bought Together</h3>
        <p>No related products found.</p>
      </div>
    );
  }

  return (
    <div className="frequently-bought-together">
      <h3>Frequently Bought Together</h3>

      {cartButtonVisible && (
        <button className="view-cart-button" onClick={() => navigate("/cartpage")}>
          View Cart
        </button>
      )}

      <div className="fbt-products">
        {products.map((p) => (
          <div key={p._id} className="fbt-card-wrapper">
            <div
              className={`fbt-card ${selectedProducts.find(sp => sp._id === p._id) ? "selected" : ""}`}
              onClick={() => toggleSelect(p)}
            >
              {/* PLUS BUTTON */}
              <button
                className="fbt-plus-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/productdetailpage/${p._id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                +
              </button>

              {/* PRODUCT IMAGE */}
              <div className="image-wrapper">
                {p.images.length > 0 && (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    onClick={() => { setPhotoIndex(0); setIsOpen(true); }}
                  />
                )}
              </div>

              {/* NAME & PRICE */}
              <p>{p.name}</p>
              <p>Rs {p.variants[0]?.discountPrice || p.variants[0]?.realPrice}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ADD ALL TO CART BUTTON */}
      <button
        className={`fbt-add-btn ${selectedProducts.length > 0 ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          handleAddAllToCart();
        }}
        disabled={selectedProducts.length === 0}
      >
        {addedToCart ? "Added to cart" : "Add to cart"}
      </button>
    </div>
  );
}

export default FrequentlyBoughtTogether;
