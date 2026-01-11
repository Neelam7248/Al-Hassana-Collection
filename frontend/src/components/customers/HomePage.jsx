import React,{ useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductContext } from "../../components/admin/ProductManagement/ProductContext";
import { CartContext } from "./CartContext";
import CartPage from "./CartPage";
import "./Home.css";
import Slider from "react-slick";
import QuickLinksSlider from "./QuickSlider";

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const { products, selectedCategoryProducts, handleCategorySelect,fetchProducts, loading, error } = useContext(ProductContext);
  const { addToCart, cartItems, showPopup,increaseQty,decreaseQty } = useContext(CartContext);
  const navigate = useNavigate();

 
  useEffect(() => {
    fetchProducts(1,10);
  }, []);

  const featuredProducts = products.slice(0, 10);

  // Get last added product for popup
  const latestItem = cartItems[cartItems.length - 1];

const categories = [
  "Jackets", "T-Shirts", "Caps", "Jeans", 
  "Shirts", "Hoodies", "Pants", "Suits"
];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1><i>Al-Hassana Collections </i></h1>
        <p></p>
      </section>
  

      {/* Featured Products */}
      <section className="featured">
        <h2>Featured Products</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((product) => (
  <div key={product._id} className="product-card">
    <img
  src={
    product.images && product.images.length > 0
      ? product.images[0]
      : "/Imageplaceholder.png"
  }
  alt={product.name || "Product Image"}
  width={150}
/>
<h6>{product.name}</h6>
    <p className="price-wrapper">
      <del className="product-price">RS{product.realPrice}</del>
      <ins className="product-price">Rs {product.discountPrice}</ins>
    </p>
    <div>
      <Link to={`/productpage/${product._id}`} className="btn-view">
        View
      </Link>
      <button
        className="btn-shop"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  </div>
))}

</div>
        )}
      </section>
      <QuickLinksSlider 
  categories={categories} 
  handleCategorySelect={handleCategorySelect} 
/>

      {/* Popup for Add to Cart */}
      {showPopup && latestItem && (
        <div className="cart-popup-overlay">
          <div className="cart-popup">
            <h4>Added to Cart!</h4>
            <div className="cart-popup-item">
              <img
  src={
    latestItem.images && latestItem.images.length > 0
      ? latestItem.images[0]
      : "/Imageplaceholder.png"
  }
  alt={latestItem.name}
  width={100}
/>
  <div className="cart-popup-buttons button">
            
                <p>{latestItem.name}</p>
                <p>Rs {latestItem.realPrice}</p>
                <p>Rs {latestItem.discountPrice}</p>
                     <button
                        
                        onClick={() => decreaseQty(latestItem._id)}
                      >
                        -
                      </button>
                      <span>{latestItem.quantity}</span>
                      <button
                        
                        onClick={() => increaseQty(latestItem._id)}
                      >
                        +
                      </button>
            
              </div>
            
                  
            </div>
            <div className="cart-popup-buttons">
              <button onClick={() => navigate(`/productpage/${latestItem._id}`)}>
                View
              </button>
              <button onClick={() => navigate("/cartpage")}>
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Page */}
      <CartPage />
<section className="about-us">
        <h2>About Us</h2>
        <p>
        Al-Hassana Collections is your premier destination for high-quality
          and affordable HAJJ nd UMRAH Variety. We pride ourselves on offering a diverse range
          of styles to suit every taste. At Al-Hassana Collections ,we understand the significance of a journey as spiritual and purifying as Hajj. 
          That is why we have curated a selection of Hajj & Umrah accessories, mainly focused on enhancing your comfort and convenience with 
          exceptional value so that you can experience your pilgrimage seamlessly without trivial inconveniences related to accessories getting
           in the way of your spiritual experience. 
          Apart from Towel Ihrams, we analyzed the main routine and the everyday hardships faced during Hajj. Our Hajj accessories are
           designed to simplify these troubles so you can maintain your focus on the actual pilgrimage. You will find soft and easily 
           storable sajdah hand towels, 
          prayer and shoe mat bags, neck bags, 
      and cotton ahram belts for easy storage of essentials and
       hand and body washes, a staple for cleanliness.

    At Al-Hassana Collections, you will find the complete Hajj accessories, each one designed thoughtfully to enhance your pilgrimage. Ultimately, we want to ensure that your Hajj 
  is convenient and comfortable, allowing you to engage fully in this holy and spiritual endeavor.

Buy soft towel Ihram at best discount sale price in Pakistan (Karachi, Hyderabad, Lahore, Faisalabad, Rawalpindi & Islamabad). 
Shop online from a wide collection. Get towel Ahram for men's, available in all sizes.
        </p>
      </section>  
      {/* Footer */}
      <footer>
        <address style={{ color: "white", backgroundColor: "black", padding: "10px" }}>
          Address: Shop no 1, United Plaza, nearest Levis factory outlet
          <br/> 
          Phone: +92 321 4943500
          <br/>
          Email: alhassana@alhassanacollections.org.pk
        </address>
      </footer>
    </div>
  );
}

export default React.memo(Home);
