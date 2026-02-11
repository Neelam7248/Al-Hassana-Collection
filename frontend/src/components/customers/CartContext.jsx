// src/context/CartContext.js
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isLoggedIn, getToken, logout, isSessionExpired } from "../../utils/auth";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const navigate = useNavigate();
  const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";

  // Cart & Popup
  const [cartItems, setCartItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Selected variant tracking
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedColors, setSelectedColors] = useState({});

  // Profile & Orders
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [orders, setOrders] = useState([]);
  const [adminContacts, setAdminContacts] = useState([]);

  // ---------------------------
  // Helper functions for variants
  // ---------------------------
  const updateSelectedSize = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const updateSelectedColor = (productId, color) => {
    setSelectedColors(prev => ({ ...prev, [productId]: color }));
  };

  const triggerAddToCartPopup = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const getVariantKey = (productId, size, color) => size + color;

  // ---------------------------
  // Cart Management
  // ---------------------------
  const addToCart = (product) => {
    const size = selectedSizes[product._id];
    const color = selectedColors[product._id];

    if (!size || !color) {
      alert(`Please select size and color for ${product.name}`);
      return;
    }

    const variant = product.variants.find(v => v.size === size && v.color === color);
    if (!variant) {
      alert("Selected variant not found!");
      return;
    }

    const variantKey = getVariantKey(product._id, size, color);

    setCartItems(prev => {
      const existing = prev.find(
        item => item._id === product._id && item.variantKey === variantKey
      );

      if (existing) {
        // Increase quantity
        return prev.map(item =>
          item._id === product._id && item.variantKey === variantKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new variant
        return [
          ...prev,
          {
            ...product,
            quantity: 1,
            selectedSize: size,
            selectedColor: color,
            selectedVariant: variant,
            variantKey,
          },
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

  // ---------------------------
  // Orders
  // ---------------------------
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

  const buyNowAll = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }
    if (!isLoggedIn()) {
      alert("Please login first");
      navigate("/signin");
      return;
    }
    if (isSessionExpired()) {
      alert("Session expired, please login again");
      logout();
      navigate("/signin");
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

  // ---------------------------
  // Profile
  // ---------------------------
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
      if (!isLoggedIn()) throw new Error("User not logged in");
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

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQty,
        decreaseQty,
        totalPrice,
        showPopup,
        triggerAddToCartPopup,
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
