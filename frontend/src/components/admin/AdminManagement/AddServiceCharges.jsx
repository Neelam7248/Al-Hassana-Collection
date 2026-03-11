import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddServiceCharges.css";
import { getToken } from "../../../utils/auth";

const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";

const AddServiceCharges = () => {
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [charge, setCharge] = useState("");
  const [charges, setCharges] = useState([]);
  const [editId, setEditId] = useState(null);
const [errorMessage, setErrorMessage] = useState("");
const [message, setMessage] = useState("");
const token = getToken();

  useEffect(() => {
    fetchCharges();
  }, []);

  const fetchCharges = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/service-charges`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCharges(res.data);
    } catch (err) {
      console.error("Error fetching charges:", err);
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage(""); // reset
  setMessage(""); // reset

  try {
    if (editId) {
      // UPDATE
      await axios.put(
        `${backendURL}/api/service-charges/${editId}`,
        { city, postalCode, charge },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      setMessage("Charge updated successfully");
    } else {
      // ADD
      await axios.post(
        `${backendURL}/api/service-charges`,
        { city, postalCode, charge },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Charge added successfully");
    }

    // reset form and fetch
    setCity("");
    setPostalCode("");
    setCharge("");
  
    fetchCharges();
setTimeout(() => setMessage(""), 3000);  
} catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      setErrorMessage(err.response.data.message);
    } else {
      setErrorMessage("Something went wrong. Please try again.");
    }
  }
};

  const handleEdit = (item) => {
    setCity(item.city);
    setPostalCode(item.postalCode || "");
    setCharge(item.charge);
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendURL}/api/service-charges/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCharges();
      setMessage("Charge deleted successfully");
    } catch (err) {
      console.error("Error deleting charge:", err);
    }
  };

  return (
    <div className="service-container">
      <h2 className="service-title">City Service Charges</h2>
{errorMessage && <p className="error-message">{errorMessage}</p>}
{message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit} className="service-form">
        <input
          className="service-input"
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          className="service-input"
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
        <input
          className="service-input"
          type="number"
          placeholder="Service Charge"
          value={charge}
          onChange={(e) => setCharge(e.target.value)}
          required
        />
        <button className="service-btn">{editId ? "Update" : "Add"}</button>
      </form>

      <table className="service-table">
        <thead>
          <tr>
            <th>City</th>
            <th>Postal Code</th>
            <th>Charge</th>
            <th>User</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {charges.map((item) => (
            <tr key={item._id}>
              <td>{item.city}</td>
              <td>{item.postalCode}</td>
              <td>{item.charge}</td>
              <td>{item.userName} ({item.userEmail})</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(item)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddServiceCharges;