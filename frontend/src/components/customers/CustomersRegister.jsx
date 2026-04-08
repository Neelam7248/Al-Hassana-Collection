import React, { useState } from "react";
import axios from "axios";
import "./CustomerRegister.css";

function CustomerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    userType: "customer", // keep this
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${backendURL}/api/auth/signup`, formData);
      console.log("Signup response:", res.data);

      // Show success message
      setMessage(res.data.message || "Check your email to verify your account");

      // Reset form fields except userType
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        userType: "customer",
      });

    } catch (err) {
      console.error("Signup error:", err);

      // Extract message from backend, fallback to generic
      setMessage(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Customer Registration</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
          />

          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            autoComplete="street-address"
          />

          {/* Hidden userType input to always send "customer" */}
          <input type="hidden" name="userType" value={formData.userType} />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Message area */}
        {message && <p className={`message ${message.includes("success") ? "success" : "error"}`}>{message}</p>}
      </div>
    </div>
  );
}

export default React.memo(CustomerRegister);