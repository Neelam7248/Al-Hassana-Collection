import React, { useEffect, useContext, useState } from "react";
import { OrderContext } from "../OrderManagement/OrderContext";
import "../../customers/Home.css";

const OrderManagement = () => {
  const { orders, fetchAllOrders, updateOrderStatus } = useContext(OrderContext);
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    fetchAllOrders(); // Fetch all orders on mount
  }, []);

  const handleStatusChange = (orderId, status) => {
    setSelectedStatus((prev) => ({ ...prev, [orderId]: status }));
  };

  const handleUpdateStatus = (orderId) => {
    if (selectedStatus[orderId]) {
      updateOrderStatus(orderId, selectedStatus[orderId]);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary mb-4">Admin Order Management</h2>

      {orders.length === 0 ? (
        <p className="text-center text-muted">No orders found</p>
      ) : (
        <div className="order-card-grid">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <h5>{order.customer.name}</h5>
              <p><strong>Email:</strong> {order.customer.email}</p>
              <p><strong>Phone:</strong> {order.customer.phone}</p>
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

              <div className="order-items">
                <strong>Items:</strong>
                {order.items.map((item, index) => (
                  <div key={index}>{item.name} x {item.quantity}</div>
                ))}
              </div>

              <p><strong>Subtotal:</strong> Rs. {order.subtotal}</p>
              <p><strong>Service Charge:</strong> Rs. {order.serviceCharge}</p>
              <p><strong>Grand Total:</strong> Rs. {order.grandTotal}</p>
              <p><strong>Status:</strong> {order.status || "Pending"}</p>
              <p><strong>Last Update:</strong> {new Date(order.updatedAt).toLocaleString()}</p>

              <div className="order-actions">
                <select
                  className="form-select"
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
                  className="btn btn-sm btn-primary mt-2"
                  onClick={() => handleUpdateStatus(order._id)}
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(OrderManagement);
