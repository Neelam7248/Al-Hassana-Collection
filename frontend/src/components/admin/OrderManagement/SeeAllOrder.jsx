import React, { useEffect, useContext, useState } from "react";
import { OrderContext } from "../OrderManagement/OrderContext";
import "../../customers/Home.css";

import {
  getToken,
  isSessionExpired,
  logout,
} from "./../../../utils/auth";

import axios from "axios";

const backendURL =
  process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";
const OrderManagement = ({ status = "all" }) => {
    const {
    orders,
    fetchAllOrders,
    deliveryBoys,
    fetchDeliveryBoys,
  } = useContext(OrderContext);

  useEffect(() => {
  const token = getToken();

  if (!token) {
    logout();
    return;
  }

  if (isSessionExpired()) {
    logout();
    return;
  }
}, []);
  const [deliveryBoyMap, setDeliveryBoyMap] = useState({});

useEffect(() => {
  const token = getToken();
  if (!token) return;

  fetchAllOrders(status);
  fetchDeliveryBoys();
}, [status]);// =========================
  // 🛵 ASSIGN ORDER
  // =========================
  const handleAssign = async (orderId) => {
    const deliveryBoyId = deliveryBoyMap[orderId]?.deliveryBoyId;

    if (!deliveryBoyId) {
      alert("Please select a delivery boy");
      return;
    }

    try {
      const token = getToken();

      await axios.put(
        `${backendURL}/api/orders/${orderId}/assign`,
        {
          deliveryBoyId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAllOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // 🔄 STATUS UPDATE (DIRECT)
  // =========================
  const handleStatusUpdate = async (orderId, status) => {
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

      fetchAllOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary mb-4">
        Admin Order Management
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-muted">No orders found</p>
      ) : (
        <div className="order-card-grid">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              {/* CUSTOMER INFO */}
              <h5>{order.customer.name}</h5>
              <p>
                <strong>Email:</strong> {order.customer.email}
              </p>
              <p>
                <strong>Phone:</strong> {order.customer.phone}
              </p>

              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <hr />

              {/* ITEMS */}
              <div className="order-items">
                <strong>Items:</strong>
                {order.items.map((item, index) => (
                  <div key={index}>
                    {item.name} × {item.quantity}
                  </div>
                ))}
              </div>

              {/* TOTALS */}
              <p>
                <strong>Subtotal:</strong> Rs. {order.subtotal}
              </p>
              <p>
                <strong>Service Charge:</strong> Rs. {order.serviceCharge}
              </p>
              <p>
                <strong>Grand Total:</strong> Rs. {order.grandTotal}
              </p>

              <p>
                <strong>Status:</strong> {order.status || "Pending"}
              </p>

              <hr />

              {/* =========================
                  ASSIGN + STATUS SECTION
              ========================= */}
              <div className="order-actions">

                {/* DELIVERY BOY SELECT */}
                <select
                  className="form-select"
                  value={deliveryBoyMap[order._id]?.deliveryBoyId || ""}
                  onChange={(e) =>
                    setDeliveryBoyMap((prev) => ({
                      ...prev,
                      [order._id]: {
                        deliveryBoyId: e.target.value,
                      },
                    }))
                  }
                >
                  <option value="">Select Delivery Boy</option>

                  {deliveryBoys.map((boy) => (
                    <option key={boy._id} value={boy._id}>
                      {boy.name} ({boy.email})
                    </option>
                  ))}
                </select>

                <button
                  className="btn btn-success btn-sm mt-2"
                  onClick={() => handleAssign(order._id)}
                >
                  Assign Order
                </button>

                {/* STATUS UPDATE */}
                <select
                  className="form-select mt-2"
                  value={order.status || "Pending"}
                  onChange={(e) =>
                    handleStatusUpdate(order._id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Picked">Picked</option>
                  <option value="OnTheWay">On The Way</option>
                  <option value="Delivered">Delivered</option>
                </select>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(OrderManagement);