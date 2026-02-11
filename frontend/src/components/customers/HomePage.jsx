import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductContext } from "../../components/admin/ProductManagement/ProductContext";
import { CartContext } from "./CartContext";
import "./Home.css";
import HeroSlider from "./HeroSlider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { categoriesConfig } from "../../config/CategoriesConfig";
import ContactForm from "./ContactUs";
import LoginForm from "../Signin";
import RegisterForm from "./CustomersRegister";
import OrderHistory from "./OrderHistory";

function Home() {
  const { products, fetchProducts, loading, error } = useContext(ProductContext);
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

  const [modalType, setModalType] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(1, 10); // fetch first 10 products
  }, []);

  const featuredProducts = products.slice(0, 10);
  const latestItem = cartItems[cartItems.length - 1];

  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <div className="home-container">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Featured Products */}
      <section className="featured">
        <h2>Featured Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : (
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            observer={true}
            observeParents={true}
            watchOverflow={true}
            breakpoints={{
              320: { slidesPerView: 1,spaceBetween: 10 },
              480: { slidesPerView: 2,spaceBetween: 10 },
              768: { slidesPerView: 6,spaceBetween: 15 },
              1024: { slidesPerView: 7,spaceBetween: 10 },
              1280: { slidesPerView: 8,spaceBetween: 10 },
            }}
          >
            {featuredProducts.map((product) => (
              <SwiperSlide key={product._id}>
                <div className="product-card">
                  <img
                    src={product.images?.[0] || "/Imageplaceholder.png"}
                    alt={product.name}
                  />
                  <h6>{product.name}</h6>
                  <p className="price-wrapper">
                    <del>Rs {product.variants[0]?.realPrice}</del>
                    <ins>Rs {product.variants[0]?.discountPrice}</ins>
                  </p>

                  {/* Variant Selectors */}
                  <div className="variant-selectors">
                    <select
                      value={selectedSizes[product._id] || ""}
                      onChange={(e) =>
                        updateSelectedSize(product._id, e.target.value)
                      }
                    >
                      <option value="">Select Size</option>
                      {[...new Set(product.variants.map((v) => v.size))].map(
                        (size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        )
                      )}
                    </select>

                    <select
                      value={selectedColors[product._id] || ""}
                      onChange={(e) =>
                        updateSelectedColor(product._id, e.target.value)
                      }
                    >
                      <option value="">Select Color</option>
                      {[...new Set(product.variants.map((v) => v.color))].map(
                        (color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="product-buttons">
                    <Link
                      to={`/productpage/${product._id}`}
                      className="btn-view"
                    >
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
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {/* Category Sections */}
      {Object.values(categoriesConfig).map((cat) => {
        const categoryProducts = products.filter(
          (p) => p.category === cat.slug
        );
        if (!categoryProducts.length) return null;

        return (
          <section key={cat.slug} className="category-products">
            <h2>{cat.label}</h2>

            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={20}
              freeMode={true}
              watchOverflow={true}
              breakpoints={{
                320: { slidesPerView: 1 ,spaceBetween: 10 },
                480: { slidesPerView: 1 ,spaceBetween: 10 },
                768: { slidesPerView: 6 ,spaceBetween: 15 },
                1024: { slidesPerView: 7 ,spaceBetween: 10 },
                1280: { slidesPerView: 8 ,spaceBetween: 10 },
              }}
            >
              {categoryProducts.map((product) => (
                <SwiperSlide key={product._id}>
                  <div className="product-card">
                    <img
                      src={product.images?.[0] || "/Imageplaceholder.png"}
                      alt={product.name}
                    />
                    <h6>{product.name}</h6>
                    <p className="price-wrapper">
                      <del>Rs {product.variants[0]?.realPrice}</del>
                      <ins>Rs {product.variants[0]?.discountPrice}</ins>
                    </p>

                    <div className="variant-selectors"> 
                      <select 
                        value={selectedSizes[product._id] || ""}
                        onChange={(e) =>
                          updateSelectedSize(product._id, e.target.value)
                        }
                      >
                        <option value="">Select Size</option>
                        {[...new Set(product.variants.map((v) => v.size))].map(
                          (size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          )
                        )}
                      </select>

                      <select 
                        value={selectedColors[product._id] || ""}
                        onChange={(e) =>
                          updateSelectedColor(product._id, e.target.value)
                        }
                      >
                        <option value="">Select Color</option>
                        {[...new Set(
                          product.variants.map((v) => v.color)
                        )].map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="product-buttons">
                      <Link
                        to={`/productpage/${product._id}`}
                        className="btn-view"
                      >
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
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        );
      })}

      {/* Cart Popup */}
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
                <p>Size: {latestItem.selectedSize}</p>
                <p>Color: {latestItem.selectedColor}</p>
                <p>Rs {latestItem.selectedVariant?.realPrice}</p>
                <p>Rs {latestItem.selectedVariant?.discountPrice}</p>
                <button
                  onClick={() =>
                    decreaseQty(latestItem._id, latestItem.variantKey)
                  }
                >
                  -
                </button>
                <span>{latestItem.quantity}</span>
                <button
                  onClick={() =>
                    increaseQty(latestItem._id, latestItem.variantKey)
                  }
                >
                  +
                </button>
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

      {/* About & Contact */}
      <section className="about-us">
        <h2>About Us</h2>
        <p>
          Al-Hassana Collections is your premier destination for high-quality
          and affordable HAJJ & UMRAH Variety. We pride ourselves on offering
          a diverse range of styles to suit every taste...
        </p>
      </section>

      <section className="contact-us">
        <h3>Contact Us</h3>
        <p className="email">
          Shop no 1, United Plaza, nearest Levis factory outlet
        </p>
        <p className="email">Phone: +92 321 4943500</p>
        <p className="email">Email: alhassana@alhassanacollections.org.pk</p>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          {/* Customer Service */}
          <div className="footer-col">
            <h4 onClick={() => toggleDropdown("customer")}>
              Customer Service
              <span className="arrow">
                {openDropdown === "customer" ? "−" : "+"}
              </span>
            </h4>
            <ul className={openDropdown === "customer" ? "open" : ""}>
              <li>
                <button onClick={() => openModal("contact")}>Contact Us</button>
              </li>
              <li>
                <Link to="/shipping">Shipping Info</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="footer-col">
            <h4 onClick={() => toggleDropdown("account")}>
              Account
              <span className="arrow">
                {openDropdown === "account" ? "−" : "+"}
              </span>
            </h4>
            <ul className={openDropdown === "account" ? "open" : ""}>
              <li>
                <button onClick={() => openModal("signin")}>My Account</button>
              </li>
              <li>
                <button onClick={() => openModal("register")}>
                  Create Account
                </button>
              </li>
              <li>
                <button onClick={() => openModal("track")}>Track Order</button>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="footer-col">
            <h4 onClick={() => toggleDropdown("about")}>
              About Us
              <span className="arrow">
                {openDropdown === "about" ? "−" : "+"}
              </span>
            </h4>
            <ul className={openDropdown === "about" ? "open" : ""}>
              <li>
                <Link to="/about">Our Story</Link>
              </li>
              <li>
                <Link to="/disclaimer">Disclaimer</Link>
              </li>
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Get In Touch</h4>
            <p className="email">alhassana@alhassanacollections.org.pk</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Al Hassana Collections</p>
        </div>

        {/* Modal */}
        {modalType && (
          <div className="modal-backdrop" onClick={closeModal}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
              {modalType === "signin" && <LoginForm closeModal={closeModal} />}
              {modalType === "register" && (
                <RegisterForm closeModal={closeModal} />
              )}
              {modalType === "track" && <OrderHistory closeModal={closeModal} />}
              {modalType === "contact" && <ContactForm closeModal={closeModal} />}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}

export default React.memo(Home);
