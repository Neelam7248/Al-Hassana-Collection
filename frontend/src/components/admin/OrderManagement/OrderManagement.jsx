// src/components/admin/ProductManagement/ProductManagement.jsx
import { useState } from "react";
import { OrderProvider } from "./OrderContext";
import SeeAllOrder from "./SeeAllOrder";
import CustomerDetails from "./CustomerOrder";
import ORDER_STATUS from "../../constants/OrderStatus";
//import DeleteProduct from "./DeleteProducts";
//import AdminInventory from "./Inventory";
import React from "react"; // ✅ required for React.memo
import DeliveryStats from "./DeliveryBoyswithAllassignedorders";
function OrderManagement() {
  const [activeTab, setActiveTab] = useState(ORDER_STATUS.ALL);

  return (
    <OrderProvider>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>🛍 Order Management</h2>

        {/* Tab Buttons */}
        <div style={{ marginBottom: "20px" }}>
       <button onClick={() => setActiveTab(ORDER_STATUS.ALL)}>All</button>

<button onClick={() => setActiveTab(ORDER_STATUS.PENDING)}>Pending</button>

<button onClick={() => setActiveTab(ORDER_STATUS.ASSIGNED)}>Assigned</button>

<button onClick={() => setActiveTab(ORDER_STATUS.OUT_FOR_DELIVERY)}>
  Out For Delivery
</button>

<button onClick={() => setActiveTab(ORDER_STATUS.DELIVERED)}>
  Delivered
</button>

<button onClick={() => setActiveTab(ORDER_STATUS.CANCELLED)}>
  Cancelled
</button>
<button onClick={() => setActiveTab("customerdetails")}>
  User Orders
</button>

<button onClick={() => setActiveTab("deliverystats")}>
  Delivery Stats
</button>
        
        </div>

       {activeTab === "all" && <SeeAllOrder status="all" />}

{activeTab === "pending" && (
  <SeeAllOrder status="pending" />
)}

{activeTab === "assigned" && (
  <SeeAllOrder status="assigned" />
)}

{activeTab === "out_for_delivery" && (
  <SeeAllOrder status="out_for_delivery" />
)}

{activeTab === "delivered" && (
  <SeeAllOrder status="delivered" />
)}

{activeTab === "cancelled" && (
  <SeeAllOrder status="cancelled" />
)}

{activeTab === "customerdetails" && (
  <CustomerDetails />
)}

{activeTab === "deliverystats" && (
  <DeliveryStats />
)} </div>
    </OrderProvider>
  );
}

export default React.memo(OrderManagement);
