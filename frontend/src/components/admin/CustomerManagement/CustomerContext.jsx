// src/context/CustomerContext.jsx
import { createContext, useState } from "react";
import axios from "axios";
import { getToken, isAdmin } from "../../../utils/auth";

export const CustomerContext = createContext();

export default function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";
  // ============================
  // 1. Fetch All Customers
  // ============================
  const fetchAllCustomers = async () => {
    if (!isAdmin()) return alert("Access denied: Admin only!");

    try {
      setLoading(true);
      const res = await axios.get(`${backendURL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
console.log("frontend receives cusomer data",res.data);
      setCustomers(res.data.users || []); // fallback to empty array
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // 2. Search Customers
  // ============================
  const searchCustomers = async (query) => {
    if (!query) return fetchAllCustomers();

    try {
      const res = await axios.get(
        `${backendURL}/api/auth/users/search?query=${query}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      console.log("front end received user data",res.data)
      setCustomers(res.data.customers || []);
    } catch (error) {
      console.error("Error searching customers:", error);
      setCustomers([]);
    }
  };

  // ============================
  // 3. Delete Customer
  // ============================
  const deleteCustomer = async (customerId) => {
  if (!window.confirm("Are you sure you want to delete this customer?")) return;

  try {
    await axios.put(
      `${backendURL}/api/auth/users/${customerId}/soft-delete`,
      {},   // body empty
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

   // setCustomers((prev) => prev.filter((c) => c._id !== customerId));
    
  } catch (error) {
    console.error("Error deleting customer:", error);
  }
};

  const restoreCustomer = async (customerId) => {
  try {
    await axios.put(
      `${backendURL}/api/auth/users/${customerId}/restore`,
      {},
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );

    // Updated restored user ko fetch kare
    fetchAllCustomers();

  } catch (error) {
    console.error("Error restoring customer:", error);
  }
};


  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        fetchAllCustomers,
        searchCustomers,
        deleteCustomer,
        restoreCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
