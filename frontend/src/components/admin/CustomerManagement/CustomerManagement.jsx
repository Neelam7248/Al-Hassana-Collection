// src/components/admin/CustomerManagement/CustomerManagement.jsx
import React, { useState } from "react";
import CustomerProvider from "../CustomerManagement/CustomerContext";
import CustomerList from "./CustomerList";

function CustomerManagement() {
  const [activeTab, setActiveTab] = useState("CList"); // initial tab

  return (
    <CustomerProvider>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>🛍 Customer Management</h2>

        {/* Tab Buttons */}
        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => setActiveTab("CList")}>Customer List</button>
          {/* Future tabs:
          <button onClick={() => setActiveTab("view")}>View Customer</button>
          <button onClick={() => setActiveTab("edit")}>Edit Customer</button>
          <button onClick={() => setActiveTab("delete")}>Delete Customer</button>
          */}
        </div>

        {/* Tab Content */}
        {activeTab === "CList" && <CustomerList />}
        {/* Future tabs:
        {activeTab === "view" && <ViewCustomer />}
        {activeTab === "edit" && <EditCustomer />}
        {activeTab === "delete" && <DeleteCustomer />}
        */}
      </div>
    </CustomerProvider>
  );
}

export default React.memo(CustomerManagement);
