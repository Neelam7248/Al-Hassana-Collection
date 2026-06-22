import React, { useState } from "react";
import axios from "axios";

function CreateUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    department: "",
    userType: "admin",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const backendURL = "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");

    if (!token) {
      setMessage("Please login first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${backendURL}/api/create-admin/create-user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        department: "",
        userType: "admin",
      });

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error creating user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Create User</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

        <select name="userType" value={formData.userType} onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="deliveryBoy">Delivery Boy</option>
        </select>

        <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} />

        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}

export default CreateUser;