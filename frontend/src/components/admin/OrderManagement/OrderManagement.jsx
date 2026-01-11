// src/components/admin/ProductManagement/ProductManagement.jsx
import { useState } from "react";
import { OrderProvider } from "./OrderContext";
import SeeAllOrder from "./SeeAllOrder";
import CustomerDetails from "./CustomerOrder";
//import DeleteProduct from "./DeleteProducts";
//import AdminInventory from "./Inventory";
import React from "react"; // ✅ required for React.memo
function OrderManagement() {
  const [activeTab, setActiveTab] = useState("");

  return (
    <OrderProvider>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>🛍 Order Management</h2>

        {/* Tab Buttons */}
        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => setActiveTab("seeAllOrder")}>All Orders</button>
          <button onClick={() => setActiveTab("customerdetails")}>User Order</button>
         
        </div>

        {/* Tab Content */}
        {activeTab === "seeAllOrder" && <SeeAllOrder />}
        {activeTab === "customerdetails" && <CustomerDetails />}
        </div>
    </OrderProvider>
  );
}

export default React.memo(OrderManagement);
