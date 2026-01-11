import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { saveAuthData } from "../utils/auth";
import "./customers/CustomersRegister"; // ✅ Aapki CSS file
function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // password toggle
const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/cartpage";

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendURL}/api/auth/signin`, {
        email,
        password,
      });

      saveAuthData(res.data.token, res.data.user);
      

      if (res.data.user.userType === "customer") navigate(from);
      else if (res.data.user.userType === "admin") navigate("/adminportal");
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        setMessage("Server not reachable. Please check backend.");
      } else {
        setMessage(error.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="register-page">
      <h2>Signin</h2>
      <div className="register-card">
        <form onSubmit={handleSignin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#0077b6",
                fontWeight: "600",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button type="submit">Signin</button>
        </form>

        <p>If you are not registered, please signup first.</p>
        <button onClick={() => navigate("/register")}>Signup/Register</button>
        <button onClick={() => navigate("/forgetpassword")}>Forgot Password</button>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default React.memo(Signin);
