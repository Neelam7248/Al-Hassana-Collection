import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DeliveryBoyeswithAllassignorders.css";
import { getToken } from "../../../utils/auth";
const backendURL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const DeliveryStats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");

  const navigate = useNavigate();
const token=getToken();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${backendURL}/api/orders/delivery-stats`,
           {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
        );

        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDetails = async (deliveryBoyId, deliveryBoyEmail) => {
    try {
      setSelectedEmail(deliveryBoyEmail);

      const res = await axios.get(
        `${backendURL}/api/orders/by-delivery-boy/${deliveryBoyId}`,
         {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
      );

      setSelectedOrders(res.data);
      setShowModal(true);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <h3 className="loading">Loading...</h3>;

  return (
    <div className="delivery-stats-container">
      <h2>📦 Delivery Boys Order Stats</h2>

      <table className="delivery-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Total Orders</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4">No Data Found</td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item.deliveryBoy?.name || "N/A"}</td>
                <td>{item.deliveryBoy?.email || "N/A"}</td>
                <td>{item.totalOrders}</td>
                <td>
                  <button
                    className="details-btn"
                    onClick={() =>
                      handleDetails(item._id, item.deliveryBoy?.email)
                    }
                    
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Orders for Delivery Boy: {selectedEmail}</h3>

            <button
              className="back-btn"
              onClick={() => setShowModal(false)}
            >
              ← Back
            </button>

            {selectedOrders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              selectedOrders.map((order, index) => (
                <div key={order._id} className="order-card">
                  <p>
                    <b>Order Details: {index + 1}</b>
                  </p>
                  <p>
                    <b>Order ID:</b> {order._id}
                  </p>
                  <p>
                    <b>Customer:</b> {order.customer?.name}
                  </p>
                  <p>
                    <b>Status:</b> {order.status}
                  </p>
                  <p>
                    <b>Grand Total:</b> {order.grandTotal} PKR
                  </p>
                  <p>
                    <b>Service Charge:</b> {order.serviceCharge} PKR
                  </p>
                  <p>
                    <b>Subtotal:</b> {order.subtotal} PKR
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryStats;