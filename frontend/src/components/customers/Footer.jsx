import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import LoginForm from "../Signin";
import RegisterForm from "./CustomersRegister";
import OrderHistory from "./OrderHistory";
import ContactForm from "./ContactUs";
import "./Footer.css";

function Footer() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [modalType, setModalType] = useState(null);
  const navigate = useNavigate();
  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <footer className="site-footer">
           <h3>About Al-Hassana Collections</h3>

      <div className="footer-container">
        {/* Customer Service */}

        <div className="footer-col">
          <h4
            className={openDropdown === "customer" ? "active" : ""}
            onClick={() => toggleDropdown("customer")}
          >
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
          <h4
            className={openDropdown === "account" ? "active" : ""}
            onClick={() => toggleDropdown("account")}
          >
            Account
            <span className="arrow">
              {openDropdown === "account" ? "−" : "+"}
            </span>
          </h4>
          <ul className={openDropdown === "account" ? "open" : ""}>
            <li>
              <button onClick={() => navigate("/signin")}>SignIn</button>
            </li>
            <li>
              <button onClick={() => navigate("/register")}>Create Account</button>
            </li>
            <li>
              <button onClick={() => navigate("/orders")}>Track Order</button>
            </li>
          </ul>
        </div>

        {/* About */}
        <div className="footer-col">
         
          <h4
            className={openDropdown === "about" ? "active" : ""}
            onClick={() => toggleDropdown("about")}
          >
            About Us
            <span className="arrow">{openDropdown === "about" ? "−" : "+"}</span>
          </h4>
          <ul className={openDropdown === "about" ? "open" : ""}>
            <li>
              <button onClick={()=>navigate("/Our-Story")}>Our Story</button>
            </li>
            <li>
              <button onClick={()=>navigate("/disclaimer")}>Disclaimer</button>
            </li>
            <li>
              <Link to="/blogs">Blogs</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Get In Touch</h4>
          <h5 className="email">alhassana@alhassanacollections.org.pk</h5>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Al Hassana Collections</p>
      </div>

      {/* Modals */}
      {modalType && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              ×
            </button>
            {modalType === "signin" && <LoginForm closeModal={closeModal} />}
            {modalType === "register" && <RegisterForm closeModal={closeModal} />}
            {modalType === "track" && <OrderHistory closeModal={closeModal} />}
            {modalType === "contact" && <ContactForm closeModal={closeModal} />}
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;