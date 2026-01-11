import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OTPVerification from "./OTPverificationForm"; // OTP component
import "./CustomerRegister.css";
//
function CustomerRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    userType: "customer",
  });
const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`${backendURL}/api/auth/signup`, formData);
console.log("Sending data:", formData);

      // OTP generate ho chuka → show OTP input
      setOtpSent(true);

    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed!");
      console.log(err);
    }
  };

  return (
    <div className="register-page">
      {!otpSent ? (
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
        </div>
      ) : (
        <OTPVerification email={formData.email} navigate={navigate} />
      )}
    </div>
  );
}

export default React.memo(CustomerRegister);
