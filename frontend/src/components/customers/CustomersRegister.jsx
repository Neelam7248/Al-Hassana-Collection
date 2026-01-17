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
    userType: "customer",
  });

  const [message, setMessage] = useState("");
  const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendURL}/api/auth/signup`, formData);
      setMessage(res.data.message); // show success message from backend
      console.log("Signup response:", res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration Failed!");
      console.log(err);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Customer Registration</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

          <label>Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />

          <button type="submit">Register</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default React.memo(CustomerRegister);
