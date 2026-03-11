// src/components/customers/CartContext.js
import { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import axios from "axios";
import { isLoggedIn, getToken, logout, isSessionExpired } from "../../utils/auth";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const navigate = useNavigate();
  const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";

  // ------------------------------
  // Cart & Popup
  // ------------------------------
  const [cartItems, setCartItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [cartButtonVisible, setCartButtonVisible] = useState(false);
const location = useLocation();
  // ------------------------------
  // Selected variants
  // ------------------------------
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedColors, setSelectedColors] = useState({});

  const updateSelectedSize = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const updateSelectedColor = (productId, color) => {
    setSelectedColors(prev => ({ ...prev, [productId]: color }));
  };

  // ------------------------------
  // Cart functions
  // ------------------------------
  const triggerAddToCartPopup = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const getVariantKey = (productId, size, color) => size + color;
// src/components/customers/CartContext.js

const addToCart = (product) => {
  // ---------------------------
  // Agar product ke variants nahi hain → direct add
  // ---------------------------
  if (!product.variants || product.variants.length === 0) {
    setCartItems(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            ...product,
            quantity: 1,
            variantKey: product._id
          }
        ];
      }
    });

    triggerAddToCartPopup();
    return;
  }

  // ---------------------------
  // Agar variants hain → handle size/color
  // ---------------------------
  const defaultVariant = product.variants[0] || {};
  const size = selectedSizes[product._id] || defaultVariant.size || "";
  const color = selectedColors[product._id] || defaultVariant.color || "";

  // Check karte hain ke product me multiple size/color variants hain
  const requiresSize = product.variants.some(v => v.size);
  const requiresColor = product.variants.some(v => v.color);

  // Agar size ya color required hai lekin select nahi → alert
  if ((requiresSize && !size) || (requiresColor && !color)) {
    alert(
      `Please select ${requiresSize ? "size" : ""} ${requiresColor ? "color" : ""} for ${product.name}`
    );
    return;
  }

  // Match variant agar exist kare
  const variant = product.variants.find(v => v.size === size && v.color === color) || defaultVariant;

  // Unique key for cart
  const variantKey = requiresSize || requiresColor ? `${size}_${color}` : product._id;

  // ---------------------------
  // Add or update cart
  // ---------------------------
  setCartItems(prev => {
    const existing = prev.find(item => item._id === product._id && item.variantKey === variantKey);
    if (existing) {
      return prev.map(item =>
        item._id === product._id && item.variantKey === variantKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          selectedSize: size,
          selectedColor: color,
          selectedVariant: variant,
          variantKey
        }
      ];
    }
  });

  triggerAddToCartPopup();
};
  const increaseQty = (productId, variantKey) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === productId && item.variantKey === variantKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (productId, variantKey) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === productId && item.variantKey === variantKey
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const removeFromCart = (productId, variantKey) => {
    setCartItems(prev =>
      prev.filter(item => !(item._id === productId && item.variantKey === variantKey))
    );
  };

  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.selectedVariant.discountPrice * item.quantity,
    0
  );
  const incompleteItems = cartItems.filter(item => !item.selectedVariant);
  const canCheckout = incompleteItems.length === 0;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ------------------------------
  // Cart button visibility
  // ------------------------------
  useEffect(() => {
    setCartButtonVisible(cartItems.length > 0);
  }, [cartItems]);

  // ------------------------------
  // Orders & profile (optional)
  // ------------------------------
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [orders, setOrders] = useState([]);
  const [adminContacts, setAdminContacts] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await axios.get(`${backendURL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    }
  };

  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError("");
    try {
      if (!isLoggedIn()) throw new Error("User not logged in");
      const token = getToken();
      const res = await axios.get(`${backendURL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      setProfileError(err.message || "Failed to fetch profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    setProfileLoading(true);
    setProfileError("");
    try {
      if (!isLoggedIn()) throw new Error("User is not logged in");
      const token = getToken();
      const res = await axios.put(`${backendURL}/api/auth/UPprofile`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.user);
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const logOut = () => {
    logout();
    clearCart();
    navigate("/signin", { replace: true });
  };

  const fetchAdminContact = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`${backendURL}/api/admin/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminContacts(res.data.adminContacts);
    } catch (err) {
      console.error("Fetch admin contacts failed", err);
    }
  };

  const buyNowAll = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }
    if (!isLoggedIn()) {
      alert("Please login first");
     navigate("/signin", {
  state: { from: location.pathname }
});
      return;
    }
    if (isSessionExpired()) {
      alert("Session expired, please login again");
      logout();
      navigate("/signin", {
        state: { from: location.pathname }
      });
      return;
    }

    for (let item of cartItems) {
      if (!item.selectedColor || !item.selectedSize) {
        alert(`Please select size and color for ${item.name}`);
        return;
      }
    }

    navigate("/checkout");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        incompleteItems,
        canCheckout,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        increaseQty,
        decreaseQty,
        totalPrice,
        showPopup,
        cartButtonVisible,
        selectedSizes,
        selectedColors,
        updateSelectedSize,
        updateSelectedColor,
        fetchProfile,
        profile,
        profileLoading,
        profileError,
        updateProfile,
        logOut,
        fetchOrders,
        orders,
        buyNowAll,
        fetchAdminContact,
        adminContacts,
        setAdminContacts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};