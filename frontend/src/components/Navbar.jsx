//import React from "react"; // ✅ required for React.memo
import React, { useState, useContext } from "react";
import { Link ,useNavigate} from "react-router-dom";
import "./Navbar.css";
import { CartContext} from "./customers/CartContext"; // ✅ Cart context
import {
  FaHome, FaUser, FaShoppingBag, FaShoppingCart,
  FaSignInAlt, FaInfoCircle, FaProductHunt
} from "react-icons/fa";
import { ProductContext } from "./admin/ProductManagement/ProductContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [isDropdown1Open, setIsDropdown1Open] = useState(false);
const [isDropdown2Open, setIsDropdown2Open] = useState(false);
const [isDropdown3Open, setIsDropdown3Open] = useState(false);
const [isDropdown4Open, setIsDropdown4Open] = useState(false);
const [isDropdown6Open, setIsDropdown6Open] = useState(false);
const [isDropdown5Open, setIsDropdown5Open] = useState(false);

const [isDropdown7Open, setIsDropdown7Open] = useState(false);
const [isDropdown8Open, setIsDropdown8Open] = useState(false);
const [isDropdown9Open, setIsDropdown9Open] = useState(false);
const [isDropdown10Open, setIsDropdown10Open] = useState(false);
const [isDropdown11Open, setIsDropdown11Open] = useState(false);


   const navigate=useNavigate();
  const { handleCategorySelect} = useContext(ProductContext); // ✅ from context

const { logOut} = useContext(CartContext); // ✅ from context

  const handleCategoryClick = (category) => {
  handleCategorySelect(category); // fetch products by category
  setIsDropdownOpen(false); 
   setIsOpen(false);        // close dropdown
  navigate("/selectedcategory");      // go to product page
};

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
  <img src="/logo192.png" alt="Logo" className="logo-img" />
  AL-HASSANA Collections
</Link>
 
 
      </div>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        &#9776;
      </div>

      <ul className={`nav-links ${isOpen ? "show" : ""}`}>
        <li><Link to="/" onClick={() => setIsOpen(false)}><FaHome /> Home</Link></li>

        {/* 🧠 Dropdown */}
        <li
          className="dropdown"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button ><FaProductHunt /> Fragrances   +</button>
          {isDropdownOpen && (
            <ul >
         
         
         <li
          className="dropdown"
          onMouseEnter={() => setIsDropdown1Open(true)}
          onMouseLeave={() => setIsDropdown1Open(false)}
        >
          
          <button > LUXURY PERFUMES   +</button>
 
              {isDropdown1Open && (
         
         <ul >
           <li
          className="dropdown"
          onMouseEnter={() => setIsDropdown10Open(true)}
          onMouseLeave={() => setIsDropdown10Open(false)}
        >
          
          <button ><FaProductHunt /> MEN'S PERFUMES   +</button>
 
              {isDropdown10Open && (
         
         <ul >
              <li onClick={() => handleCategoryClick("jackets")}>ETAT</li>
              
                        
          </ul>
          )}

        </li>
         <li
          className="dropdown"
          onMouseEnter={() => setIsDropdown11Open(true)}
          onMouseLeave={() => setIsDropdown11Open(false)}
        >
          
          <button > WOMEN'S PERFUMES   +</button>
 
              {isDropdown11Open && (
         
         <ul >
              <li onClick={() => handleCategoryClick("jackets")}>ETAT</li>
              
                        
          </ul>
          )}

        </li>
        <li onClick={() => handleCategoryClick("jeans")}>D</li>
            <li onClick={() => handleCategoryClick("shirts")}>E</li>
            <li onClick={() => handleCategoryClick("hoodies")}>F</li>
            <li onClick={() => handleCategoryClick("pants")}>g</li>
            <li onClick={() => handleCategoryClick("suits")}>h</li>
            
                        
          </ul>
          )}

        </li>
        
         
         
         <li
          className="dropdown"
          onMouseEnter={() => setIsDropdown2Open(true)}
          onMouseLeave={() => setIsDropdown2Open(false)}
        >
          
          <button > SIGNATURE PERFUMES   +</button>
 
              {isDropdown2Open && (
         
         <ul >
              <li onClick={() => handleCategoryClick("jackets")}>ETAT</li>
              <li onClick={() => handleCategoryClick("t-shirts")}>B</li>
            <li onClick={() => handleCategoryClick("caps")}>C</li>
            <li onClick={() => handleCategoryClick("jeans")}>D</li>
            <li onClick={() => handleCategoryClick("shirts")}>E</li>
            <li onClick={() => handleCategoryClick("hoodies")}>F</li>
            <li onClick={() => handleCategoryClick("pants")}>g</li>
            <li onClick={() => handleCategoryClick("suits")}>h</li>
            
                        
          </ul>
          )}

        </li>
              <li onClick={() => handleCategoryClick("jackets")}>SIGNATURE PERFUMES-GIFT EDDITION  </li>
     
              <li onClick={() => handleCategoryClick("t-shirts")}>MINI-SCENT TESTER</li>
            <li onClick={() => handleCategoryClick("caps")}>LUXURY ATTARS</li>
     

    <li
          className="dropdown"
          onMouseEnter={() => setIsDropdown3Open(true)}
          onMouseLeave={() => setIsDropdown3Open(false)}
        >
          
          <button > NON-ALCOHOLIC ATTARS  +</button>
 
              {isDropdown3Open && (
         
         <ul >
             <li onClick={() => handleCategoryClick("suits")}>h</li>
            
                        
          </ul>
          )}

        </li>
     

    <li
          className="dropdown"
          onMouseEnter={() => setIsDropdown4Open(true)}
          onMouseLeave={() => setIsDropdown4Open(false)}
        >
          
          <button > FRAGRANCES-DEALS & BUNDLES   +</button>

              {isDropdown4Open && (
         
         <ul >
              <li onClick={() => handleCategoryClick("jackets")}>ETAT</li>
                        
          </ul>
          )}

        </li>
          
            <li onClick={() => handleCategoryClick("jeans")}>BAKHOORE</li>
            <li onClick={() => handleCategoryClick("shirts")}>ELECTRIC BURNER</li>
            
                        
          </ul>
          )}
        </li>
 {/* 🧠 Dropdown FOR HAJJ VARIETY*/}
        <li
          className="dropdown"
          onMouseEnter={() => setIsDropdown5Open(true)}
          onMouseLeave={() => setIsDropdown5Open(false)}
        >
          <button ><FaProductHunt /> HAJJ UMRAH VARIETY   +</button>
          {isDropdown5Open && (
            <ul >
         
         
         <li
          className="dropdown"
          onMouseEnter={() => setIsDropdown6Open(true)}
          onMouseLeave={() => setIsDropdown6Open(false)}
        >
          
          <button > Male accessaries +</button>
 
              {isDropdown6Open && (
         
         <ul >
              <li onClick={() => handleCategoryClick("jackets")}>Ahram -Ihram</li>
              <li onClick={() => handleCategoryClick("t-shirts")}>Neck Bags</li>
             <li onClick={() => handleCategoryClick("t-shirts")}>Ahram Belts</li>
  <li onClick={() => handleCategoryClick("t-shirts")}>Hand Towels</li>
  <li onClick={() => handleCategoryClick("t-shirts")}>Hands & BodyWash</li>
   <li onClick={() => handleCategoryClick("t-shirts")}>Prayer & Shoe Mat Bags</li>
                                            
                        
          </ul>
          )}

        </li>
        
         
         
         <li
          className="dropdown"
          onMouseEnter={() => setIsDropdown7Open(true)}
          onMouseLeave={() => setIsDropdown7Open(false)}
        >
          
          <button ><FaProductHunt /> Female accessaries  +</button>
 
              {isDropdown7Open && (
         
         <ul >
              <li onClick={() => handleCategoryClick("jackets")}>Abayas</li>
              <li onClick={() => handleCategoryClick("t-shirts")}>Scarves</li>
            <li onClick={() => handleCategoryClick("caps")}>Hijjab Caps</li>
            <li onClick={() => handleCategoryClick("jeans")}>Hijjab Pins </li>
            <li onClick={() => handleCategoryClick("shirts")}>Veils</li>
            <li onClick={() => handleCategoryClick("hoodies")}>Scrunchies - Hair Clamps</li>
            <li onClick={() => handleCategoryClick("pants")}>Hand Towels</li>
            <li onClick={() => handleCategoryClick("suits")}>Sun Blocks</li>
             
            
                        
          </ul>
          )}

        </li>
             
             

    <li
          className="dropdown"
          onMouseEnter={() => setIsDropdown8Open(true)}
          onMouseLeave={() => setIsDropdown8Open(false)}
        >
          
          <button ><FaProductHunt /> Tasbeeha /Counters  +</button>
 
              {isDropdown8Open && (
         
         <ul >
              <li onClick={() => handleCategoryClick("jackets")}>ETAT</li>
              <li onClick={() => handleCategoryClick("t-shirts")}>B</li>
            <li onClick={() => handleCategoryClick("caps")}>C</li>
            <li onClick={() => handleCategoryClick("jeans")}>D</li>
            <li onClick={() => handleCategoryClick("shirts")}>E</li>
            <li onClick={() => handleCategoryClick("hoodies")}>F</li>
            <li onClick={() => handleCategoryClick("pants")}>g</li>
            <li onClick={() => handleCategoryClick("suits")}>h</li>
            
                        
          </ul>
          )}

        </li>
     

    <li
          className="dropdown"
          onMouseEnter={() => setIsDropdown9Open(true)}
          onMouseLeave={() => setIsDropdown9Open(false)}
        >
          
          <button ><FaProductHunt /> Bags +</button>
 
              {isDropdown9Open && (
         
         <ul >
              <li onClick={() => handleCategoryClick("jackets")}>ihram Belts</li>
             <li onClick={() => handleCategoryClick("jackets")}>Neck Bags</li>
             
            
                        
          </ul>
          )}

        </li>
          
            <li onClick={() => handleCategoryClick("jeans")}>Towels </li>
                        
          </ul>
          )}
        </li>

        <li><Link to="/cartpage" onClick={() => setIsOpen(false)}><FaShoppingCart /> Cart</Link></li>
        <li><Link to="/orders" onClick={() => setIsOpen(false)}><FaShoppingBag /> Orders</Link></li>
        <li><Link to="/profile" onClick={() => setIsOpen(false)}><FaUser /> Profile</Link></li>
        <li><Link to="/signin" onClick={() => setIsOpen(false)}><FaSignInAlt /> Signin</Link></li>
        <li><Link to="/register" onClick={() => setIsOpen(false)}><FaInfoCircle /> Register</Link></li>
       <li><Link to="/about" onClick={() => setIsOpen(false)}><FaInfoCircle /> Contact US</Link></li>
       
       <li>
         <button
  onClick={() => {
    logOut();
    setIsOpen(false);     // ✅ close menu
  }}
>
  <FaInfoCircle /> Logout
</button>

        </li>
      </ul>
    </nav>
  );
}

export default React.memo(Navbar) ;
