import React, { useContext, useEffect, useState } from "react";
import { OrderContext } from "./OrderContext";
import "../../customers/Home.css"; // Separate CSS

 function UserOrders({ email }) {
  const { orders, updateOrderStatus, fetchUserOrders } = useContext(OrderContext);
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    if (email) fetchUserOrders(email);
  }, [email]);

  const handleStatusChange = (orderId, status) => {
    setSelectedStatus((prev) => ({ ...prev, [orderId]: status }));
  };

  const handleUpdateStatus = (orderId) => {
    if (selectedStatus[orderId] && selectedStatus[orderId] !== orders.find(o => o._id === orderId).status) {
      updateOrderStatus(orderId, selectedStatus[orderId]);
    }
  };

  if (!orders || orders.length === 0) {
    return <p className="text-center text-muted">No orders found for {email}</p>;
  }

  return (
    <div className="orders-container">
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <h6 className="order-id">Order ID: {order._id}</h6>
          <p className="order-date">Created: {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Customer:</strong> {order.customer.name}</p>
          <p><strong>Email:</strong> {order.customer.email}</p>
          <div className="order-items">
            <strong>Items:</strong>
            {order.items.map((item, idx) => (
              <div key={idx} className="item">
                {item.name} x {item.quantity}
              </div>
            ))}
          </div>
          <p><strong>Subtotal:</strong> Rs. {order.subtotal}</p>
          <p><strong>Service Charge:</strong> Rs. {order.serviceCharge}</p>
          <p><strong>Grand Total:</strong> Rs. {order.grandTotal}</p>
          <p className="order-status">
            <strong>Status:</strong> {order.status || "Pending"} <br />
            <small className="updated">Updated: {new Date(order.updatedAt).toLocaleString()}</small>
          </p>
          <select
            className="status-select"
            value={selectedStatus[order._id] || order.status || "Pending"}
            onChange={(e) => handleStatusChange(order._id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            className="update-btn"
            onClick={() => handleUpdateStatus(order._id)}
            disabled={selectedStatus[order._id] === order.status}
          >
            Update Status
          </button>
        </div>
      ))}
    </div>
  );
}
export default React.memo(UserOrders);