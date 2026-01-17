import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (token) {
      axios.get(`${backendURL}/api/auth/verify-email?token=${token}`)
        .then(res => {
          setMessage(res.data.message);
          // Redirect to login after 2s
          setTimeout(() => navigate("/signin"), 2000);
        })
        .catch(err => {
          setMessage(err.response?.data?.message || "Verification failed");
        });
    }
  }, [token, backendURL, navigate]);

  return (
    <div>
      <h2>Email Verification</h2>
      {message ? <p>{message}</p> : <p>Verifying...</p>}
    </div>
  );
};

export default VerifyEmail;
