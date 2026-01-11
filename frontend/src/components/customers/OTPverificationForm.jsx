import React,{ useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
 function OTPVerification({ email }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
const navigate = useNavigate();
const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";
  const handleVerify = async () => {
    try {
      const res = await axios.post(`${backendURL}/api/auth/verify-otp`, {
        email,
        otp
      });
      setMessage(res.data.message);
      
      // ✅ OTP verified, navigate to signin after short delay
      setTimeout(() => {
        navigate("/signin");
      }, 1500);

    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div>
      <h2>Enter OTP sent to {email}</h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={handleVerify}>Verify OTP</button>
      {message && <p>{message}</p>}
    </div>
  );
}
export default React.memo(OTPVerification);