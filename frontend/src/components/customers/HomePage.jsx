// Home.js
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
import CartPopup from "./CartPopup";
import Footer from "./Footer";
function Home() {
  const { products, fetchProducts, loading, error } = useContext(ProductContext);
  const {
    addToCart,
    cartButtonVisible,
  } = useContext(CartContext);

  const [modalType, setModalType] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(1, 10); // fetch first 10 products
  }, []);

  const featuredProducts = products.slice(0, 10);

  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <div className="home-container">
      {/* Hero Slider */}
     
      {/* View Cart Button */}
      {cartButtonVisible && (
        <button
          className="view-cart-button"
          onClick={() => navigate("/cartpage")}
        >
          View Cart
        </button>
      )}

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
             slidesPerView={Math.min(featuredProducts.length, 6)} // show max 6 slides or less if not enough products
            observeParents={true}
            watchOverflow={true}
            loop={true}
            breakpoints={{
             
              360: { slidesPerView: 2, spaceBetween: 5 },
              480: { slidesPerView: 2, spaceBetween: 5 },
              767: { slidesPerView: 4, spaceBetween: 5 },
             
              1024: { slidesPerView: 7, spaceBetween: 5 },
              1280: { slidesPerView: 8, spaceBetween: 5 },
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

                  <div className="product-buttons">
                    <Link to={`/productdetailpage/${product._id}`} className="btn-view">
                      View
                    </Link>
                    <button className="btn-shop" onClick={() => addToCart(product)}>
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
        const categoryProducts = products.filter((p) => p.category === cat.slug);
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
              loop={true}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 10 },
                480: { slidesPerView: 2, spaceBetween: 10 },
                768: { slidesPerView: 4, spaceBetween: 15 },
                1024: { slidesPerView: 7, spaceBetween: 10 },
                1280: { slidesPerView: 8, spaceBetween: 10 },
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

                    
                    <div className="product-buttons">
                      <Link to={`/productdetailpage/${product._id}`} className="btn-view">
                        View
                      </Link>
                      <button className="btn-shop" onClick={() => addToCart(product)}>
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
      <CartPopup />

      {/* About & Contact */}
      <section className="about-us">
        <h2>About Us</h2>
        <p>
          Al-Hassana Collections is your premier destination for high-quality
          and affordable HAJJ & UMRAH Variety. We pride ourselves on offering
          a diverse range of styles to suit every taste...
        </p>
      </section>

      {/* Footer */}
      <Footer
      />
   
    </div>
  );
}

export default React.memo(Home);
