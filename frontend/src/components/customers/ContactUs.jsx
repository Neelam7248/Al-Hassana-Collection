import React, { useState } from "react";
import "./CustomerRegister.css";
 import axios from "axios"; 
// your existing CSS

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.email || !formData.message) {
    setStatus("⚠️ Please fill in all required fields");
    return;
  }

  try {
    const res = await axios.post(`{backendURL}/api/contact`, formData);
    if (res.status === 200) {
      setStatus("✅ Message sent successfully .Response to your querry can take 12days!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  } catch (err) {
    setStatus("❌ Failed to send message. Try again later.");
  }

  setTimeout(() => setStatus(""), 3000);
};


  return (
    <div className="register-page">
      <div className="register-card" style={{ maxWidth: "500px" }}>
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
            style={{ resize: "none", marginTop: "10px" }}
          ></textarea>
          <button type="submit">Send Message</button>
        </form>

        {status && (
          <p style={{ color: status.includes("✅") ? "green" : "red", marginTop: "10px" }}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

export default React.memo(ContactForm);
