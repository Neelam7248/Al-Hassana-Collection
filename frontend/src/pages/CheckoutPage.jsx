// src/pages/CheckoutPage.js
import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../components/customers/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../utils/auth";
import "./CheckoutPage.css";
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, profile, fetchProfile, clearCart } = useContext(CartContext);
  const [message, setMessage] = useState("");
const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    postalCode: "",
    address: "",
    paymentMethod: "cod",
  });

  const [serviceCharge] = useState(200);

  // Fetch profile on page load
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setMessage("Session expired. Please login again.");
      return;
    }
    fetchProfile().catch(() => {
      setMessage("Session expired. Please login again.");
    });
  }, []);

  // Update formData when profile is fetched
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || "",
        email: profile.email || "",
      }));
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.postalCode) {
      alert("Please fill all required fields!");
      return;
    }

    const orderDetails = {
      customer: { ...formData },
      items: cartItems,
      subtotal: totalPrice,
      serviceCharge,
      grandTotal: totalPrice + serviceCharge,
    };

    if (formData.paymentMethod === "cod") {
      try {
        const token = getToken();
        if (!token) {
          alert("Please login to place your order!");
          return;
        }

        await axios.post(
          `${backendURL}/api/orders`,
          orderDetails,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        alert("Order placed successfully!");
        clearCart();
        navigate("/");
      } catch (error) {
        console.error("❌ Order failed:", error);
        alert("Something went wrong while placing your order!");
      }
    } else {
      alert("Online payment option coming soon!");
    }
  };

  return (
    <div className="checkout-page container mt-4">
      <h2 className="text-center text-primary mb-4">Checkout</h2>

      {message && (
        <div className="alert alert-danger text-center">
          {message}
        </div>
      )}

      {cartItems.length === 0 ? (
        <p className="empty-text">Your cart is empty</p>
      ) : (
        <div className="row">
          {/* Cart Items */}
          <div className="col-lg-6 mb-4" style={{ maxHeight: "500px", overflowY: "auto" }}>
            {cartItems.map((item) => (
              <div key={item._id} className="card product-card mb-3 shadow-sm">
                {item.images && item.images[0] && (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="card-img-top"
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
        
        <p className="fw-semibold">Size Taken:{item.selectedSize}</p>
                  <p className="text-success fw-semibold">Price: Rs. {item.discountPrice}</p>
                  
                  <p className="fw-semibold">Subtotal: Rs. {item.discountPrice * item.quantity}</p>

                </div>
              </div>
            ))}
          </div>

          {/* Checkout Form */}
          <div className="col-lg-6">
            <form
              onSubmit={handleConfirmOrder}
              className="checkout-form p-4 bg-light rounded shadow-sm"
            >
              <h5 className="text-primary mb-3">Your Details</h5>

              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={!!message}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Auto-filled based on address"
                  required
                  disabled={!!message}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your full address"
                  disabled={!!message}
                />
              </div>

              {/* Payment Method */}
              <h6 className="text-primary">Payment Method</h6>
              <div className="mb-3 d-flex gap-3">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                    disabled={!!message}
                  />
                  <label className="form-check-label">Cash on Delivery</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={handleChange}
                    disabled={!!message}
                  />
                  <label className="form-check-label">Online Payment</label>
                </div>
              </div>

              {/* Order Summary */}
              <div className="cart-summary text-end fw-semibold text-primary">
                Subtotal: Rs. {totalPrice} <br />
                Service Charges: Rs. {serviceCharge} <br />
                Grand Total: Rs. {totalPrice + serviceCharge}
              </div>

              <button
                type="submit"
                className="checkout-btn btn w-100"
                disabled={!!message}
              >
                Confirm Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CheckoutPage);
