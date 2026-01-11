import React, { useContext, useEffect } from "react";
import { CartContext } from "../customers/CartContext";
import "./OrderHistory.css";

const OrderHistory = () => {
  const { orders, fetchOrders, fetchAdminContact, adminContacts } = useContext(CartContext);

  useEffect(() => {
    fetchOrders(); // fetch orders on component mount
    fetchAdminContact(); // fetch admin contact on mount
  }, []);

  return (
    <div className="order-history">
      <h2>Order History</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        // Wrap all order cards inside this grid container
        <div className="order-card-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <h3>Order ID: {order._id}</h3>
              <p><strong>Name:</strong> {order.customer.name}</p>
              <p><strong>Email:</strong> {order.customer.email}</p>
              <p><strong>Phone:</strong> {order.customer.phone}</p>
              <p><strong>Address:</strong> {order.customer.address}</p>
              <p><strong>Payment:</strong> {order.customer.paymentMethod}</p>
              <p><strong>Status:</strong> {order.status}</p>

              <h4>Items:</h4>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }}
                      />
                    ) : (
                      <div  style={{ width: "50px", height: "50px", backgroundColor: "#ccc", display: "inline-block", marginRight: "10px" }}></div>
                    )}

                    {item.name} - Qty: {item.quantity} - Price: {item.price}- Size: {item.selectedSize} - Color: {item.selectedColor}
                  </li>
                ))}
              </ul>

              <h4>Totals:</h4>
              <p>
                <b>Subtotal:</b> {order.subtotal}, <b>Service Charges:</b> {order.serviceCharge}, <b>Grand Total:</b> {order.grandTotal}
              </p>

              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Admin Contact */}
      {adminContacts && adminContacts.length > 0 && (
        <div className="admin-contact-list">
          <h5>Contact Admins</h5>
          {adminContacts.map((admin, idx) => (
            <div key={idx} className="admin-contact">
              <p><b>Name:</b> {admin.name}</p>
              <p><b>Designation:</b>Admin</p>
              <p><b>Phone:</b> <a href={`tel:${admin.phone}`}>{admin.phone}</a></p>
              <p>
                <b>WhatsApp:</b>{" "}
                <a
                  href={`https://wa.me/${admin.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </p>
            </div>
          ))}</div>
)}

    </div>
  );
};

export default React.memo(OrderHistory);
