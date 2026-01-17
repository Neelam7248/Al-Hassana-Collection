import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { CartContext } from "./customers/CartContext";
import { categoriesConfig } from "../config/CategoriesConfig";
import { FaHome, FaUser, FaShoppingBag, FaShoppingCart, FaSignInAlt,FaSignOutAlt, FaInfoCircle, FaProductHunt } from "react-icons/fa";
import { ProductContext } from "./admin/ProductManagement/ProductContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isDropdownAuthOpen, setIsDropdownAuthOpen] = useState(false);

  const navigate = useNavigate();
  const { handleCategorySelect } = useContext(ProductContext);
  const { logOut } = useContext(CartContext);

  const handleCategoryClick = (categorySlug) => {
  handleCategorySelect(categorySlug); // use slug instead of label
  setIsOpen(false);
  setActiveMenu(null); // ✅ reset active menu so dropdown can open again
  navigate("/selectedcategory");
};

  // Recursive menu rendering
  const renderMenu = (menu) => {
    return Object.entries(menu).map(([key, item]) => (
      <li
  key={key}
  className={item.subCategories ? "dropdown" : ""}
  style={{ position: "relative" }}
>
  {item.subCategories ? (
    <>
      <button onClick={() => setActiveMenu(activeMenu === key ? null : key)}>
        <FaProductHunt /> {item.label} +
      </button>

      {activeMenu === key && (
        <ul className="dropdown-menu">
          {Object.entries(item.subCategories).map(([subKey, subItem]) => (
            <li
              key={subKey}
              onClick={() => handleCategoryClick(subItem.slug)}
            >
              {subItem.label}
            </li>
          ))}
        </ul>
      )}
    </>
  ) : (
    <span onClick={() => handleCategoryClick(item.slug)}>
      {item.label}
    </span>
  )}
</li>
    ));
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <Link to="/">
            <img src="/logo192.png" alt="Logo" className="logo-img" />
            AL-HASSANA Collections
          </Link>
        </div>
      </div>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        &#9776;
      </div>

      <ul className={`nav-links ${isOpen ? "show" : ""}`}>
        <li>
          <Link to="/" onClick={() => setIsOpen(false)}>
            <FaHome /> Home
          </Link>
        </li>

        {/* Dynamic Categories */}
        {renderMenu(categoriesConfig)}

        <li>
          <Link to="/cartpage" onClick={() => setIsOpen(false)}>
            <FaShoppingCart /> Cart
          </Link>
        </li>

        {/* Account Dropdown */}
        <li
          className="dropdown"
          onMouseEnter={() => setIsDropdownAuthOpen(true)}
          onMouseLeave={() => setIsDropdownAuthOpen(false)}
        >
          <button>
            <FaInfoCircle /> Account +
          </button>

          <ul
            className="dropdown-menu"
            
          >
            <li>
              <button onClick={() => { logOut(); setIsOpen(false); }}>< FaSignOutAlt />Logout</button>
            </li>
            <li>
              <Link to="/register" onClick={() => setIsOpen(false)}><FaSignInAlt/>Register</Link>
            </li>
            <li>
              <Link to="/signin" onClick={() => setIsOpen(false)}><FaSignInAlt/>Sign In</Link>
            </li>
           
            <li>
              <Link to="/orders" onClick={() => setIsOpen(false)}><FaShoppingBag /> Orders</Link>
            </li>
            <li>
              <Link to="/profile" onClick={() => setIsOpen(false)}><FaUser /> Profile</Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsOpen(false)}> <FaInfoCircle /> Contact Us</Link>
            </li>
          </ul>
        </li>
      </ul>

     
    </nav>
  );
}

export default React.memo(Navbar);
