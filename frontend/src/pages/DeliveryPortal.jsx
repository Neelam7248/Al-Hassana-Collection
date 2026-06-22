import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import "./DeliveryPortal.css";

const backendURL =
  process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);

  const fetchMyOrders = async () => {
    try {
      const token = getToken();

      const res = await axios.get(`${backendURL}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const token = getToken();

      await axios.put(
        `${backendURL}/api/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchMyOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="delivery-container">
      <h2 className="title">🚚 Delivery Dashboard</h2>

      {orders.length === 0 ? (
        <p className="empty">No assigned orders</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <h3>{order.customer.name}</h3>
              <span className="order-id">#{order._id}</span>
            </div>

            <div className="order-info">
              <p><b>Address:</b> {order.customer.address}</p>
              <p><b>Phone:</b> {order.customer.phone}</p>
            </div>

            <div className="items">
              {order.items.map((item, i) => (
                <p key={i}>
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>

            <p className="status">
              <b>Status:</b> {order.status}
            </p>

            <div className="buttons">
              <button
                className="btn picked"
                onClick={() => updateStatus(order._id, "Picked")}
              >
                Picked
              </button>

              <button
                className="btn onway"
                onClick={() => updateStatus(order._id, "OnTheWay")}
              >
                On The Way
              </button>

              <button
                className="btn delivered"
                onClick={() => updateStatus(order._id, "Delivered")}
              >
                Delivered
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DeliveryDashboard;