import React, { useState } from "react";
import axios from "axios";
import "../../customers/CustomerRegister.css"; // CSS applied

function AdminCreateAdmin() {
 const [adminData, setAdminData] = useState({
  name: "",
  email: "",
  password: "",
  phone: "",
  userType: "admin",
  department: "", // new field
});

const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";
  const [step, setStep] = useState(1); // Step 1: Signup, Step 2: OTP Verification
  const [otp, setOtp] = useState("");
  const [adminId, setAdminId] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  // Step 1: Create Admin & send OTP
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${backendURL}/api/create-admin`,
        adminData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAdminId(res.data.adminId);
      setStep(2); // move to OTP step
      setMessage("OTP sent to admin email. Please enter OTP to verify.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating admin");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendURL}/api/create-admin/verify-otp`, {
        email: adminData.email,
        otp,
      });

      setMessage("✅ Admin verified successfully!");
      setStep(1); // reset to initial step
      setAdminData({
        name: "",
        email: "",
        password: "",
        phone: "",
        userType: "admin",
      });
      setOtp("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Create New Admin</h2>

        {message && <p style={{ color: message.includes("✅") ? "green" : "red" }}>{message}</p>}

        {step === 1 && (
          <form onSubmit={handleSignup}>
            <input
              type="text"
              name="name"
              placeholder="Admin Name"
              value={adminData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={adminData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={adminData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={adminData.password}
              onChange={handleChange}
              required
            />

            <select
              name="userType"
              value={adminData.userType}
              onChange={handleChange}
            >
              <option value="admin">Admin</option>
            </select>
<select
  name="department"
  value={adminData.department || ""}
  onChange={handleChange}
  required
>
  <option value="">Select Department</option>
  <option value="IT">IT</option>
  <option value="HR">HR</option>
  <option value="ACC">Accounting</option>
</select>

            <button type="submit">Create Admin</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit">Verify OTP</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default React.memo(AdminCreateAdmin);
