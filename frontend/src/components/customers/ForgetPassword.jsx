import React, { useState } from "react";
import axios from "axios";
import "./CustomerRegister.css"; // Use existing register CSS
 function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEPassword, setNewEPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";
  // Step 1: Send OTP
  const handleSendOTP = async () => {
    try {
      const res = await axios.post( `${backendURL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    try {
      const res = await axios.post(`${backendURL}/api/auth/verify-forgot-otp`, {
        email,
        otp
            });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    try {
      const res = await axios.post(`${backendURL}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
        newEPassword
      });

      setMessage(res.data.message);
      setTimeout(() => (window.location.href = "/signin"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card" style={{ maxWidth: "500px" }}>
        <h2>Forgot Password</h2>

        {/* Step 1 */}
        {step === 1 && (
          <div className="fp-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSendOTP}>Send OTP</button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="fp-form">
            <p>OTP sent to: <strong>{email}</strong></p>

            <input
              type="email"
              placeholder="Confirm your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={handleVerifyOTP}>Verify OTP</button>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="fp-form">
            {/* Password Field with Show/Hide Button */}
            <div className="fp-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <span
                className="fp-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <input
              type="password"
              placeholder="Re-enter new password"
              value={newEPassword}
              onChange={(e) => setNewEPassword(e.target.value)}
            />

            <button onClick={handleResetPassword}>Reset Password</button>
          </div>
        )}

        {message && <p className="fp-message">{message}</p>}
      </div>
    </div>
  );
}
export default React.memo(ForgotPassword);