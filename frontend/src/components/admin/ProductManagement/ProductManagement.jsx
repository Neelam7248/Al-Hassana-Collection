// src/components/admin/ProductManagement/ProductManagement.jsx
import { useState } from "react";
import { ProductProvider } from "./ProductContext";
import AddProduct from "./AddProducts";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProducts";
import AdminInventory from "./Inventory";
import React from "react"; // ✅ required for React.memo
function ProductManagement() {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <ProductProvider>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>🛍 Product Management</h2>

        {/* Tab Buttons */}
        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => setActiveTab("add")}>Add Product</button>
          <button onClick={() => setActiveTab("edit")}>Edit Product</button>
          <button onClick={() => setActiveTab("delete")}>Delete Product</button>
         <button onClick={() => setActiveTab("inventory")}>Inventory</button>
        
        </div>

        {/* Tab Content */}
        {activeTab === "add" && <AddProduct />}
        {activeTab === "edit" && <EditProduct />}
        {activeTab === "delete" && <DeleteProduct />}
        
        {activeTab === "inventory" && <AdminInventory />}
      </div>
    </ProductProvider>
  );
}

export default React.memo(ProductManagement);
