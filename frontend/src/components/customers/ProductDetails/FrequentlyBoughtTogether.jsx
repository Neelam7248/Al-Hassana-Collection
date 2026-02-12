import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../CartContext";
import axios from "axios";
import "./FrequentlyBoughtTogether.css";
import { useNavigate } from "react-router-dom";
function FrequentlyBoughtTogether({ productId , product, addToCart}) {
  const { JustaddToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";
const navigate = useNavigate();
  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/products/frequently-bought/${productId}`);
        console.log("Frequently Bought Together products:", res.data);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch frequently bought together products:", err);
      }
    };
    fetchRelatedProducts();
  }, [productId]);

  const toggleSelect = (product) => {
    setSelectedProducts(prev => {
      if (prev.find(p => p._id === product._id)) {
        return prev.filter(p => p._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };
const handleAddAllToCart = () => {
    if (!product) return alert("Main product not loaded yet");
    const allProducts = [...selectedProducts, product];  // main product directly
    allProducts.forEach(p => JustaddToCart(p));
  };

  if (!products.length) return null;

  return (
    <div className="frequently-bought-together">
      <h3>Frequently Bought Together</h3>
      <div>
      <div className="fbt-products">
        {products.map((p) => (
  <div key={p._id} className="fbt-card-wrapper">

    {/* ✅ CARD */}
    <div
      className={`fbt-card ${
        selectedProducts.find((sp) => sp._id === p._id)
          ? "selected"
          : ""
      }`}
      onClick={() => toggleSelect(p)}
    >

      {/* ✅ PLUS BUTTON INSIDE CARD */}
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
      <img
        src={
          p.images?.[0]?.startsWith("http")
            ? p.images[0]
            : `/uploads/${p.images?.[0]}`
        }
        alt={p.name}
        className="fbt-img"
      />

      <p>{p.name}</p>
      <p>
        Rs {p.variants[0]?.discountPrice || p.variants[0]?.realPrice}
      </p>

      {/* ADD TO CART */}
      <button
        className="fbt-add-btn"
        onClick={(e) => {
          e.stopPropagation();
          JustaddToCart(p);
        }}
      >
        Add to Cart
      </button>
    </div>
  </div>
))}

      </div>
    
</div>
      <button className="fbt-add-btn" onClick={(e)=>{
       e.stopPropagation();
       handleAddAllToCart();
      }}
      
     >
        Add Selected to Cart
      </button>
    </div>
  );
}

export default FrequentlyBoughtTogether;
