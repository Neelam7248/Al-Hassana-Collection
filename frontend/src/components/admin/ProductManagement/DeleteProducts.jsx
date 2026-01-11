// src/components/admin/ProductManagement/DeleteProduct.jsx
import React, { useState, useContext } from "react";
import { ProductContext } from "./ProductContext";

function DeleteProduct() {
  const { products, deleteProduct } = useContext(ProductContext);
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");

  const selectedProduct = products.find((p) => p._id === selectedId);

  const handleDelete = () => {
    if (!selectedId) {
      setMessage("⚠️ Select a product first!");
      return;
    }
    deleteProduct(selectedId);
    setMessage("✅ Product deleted successfully!");
    setSelectedId("");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="register-page">
      <h3>Delete Product</h3>

      {/* Select Product */}
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        style={{ marginBottom: "10px", width: "100%", padding: "5px" }}
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>
            {p.category},{p.name},stock:{p.stock}
          </option>
        ))}
      </select>

      {/* Display selected product info */}
      {selectedProduct && (
        <div className="register-card" style={{ padding: "15px" }}>
          {/* Images */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
            {selectedProduct.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`product-${index}`}
                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }}
              />
            ))}
          </div>

          <p><strong>Name:</strong> {selectedProduct.name}</p>
          <p><strong>Category:</strong> {selectedProduct.category}</p>
          <p><strong>Price:</strong> {selectedProduct.price} PKR</p>

          {/* Sizes */}
          <div>
            <strong>Stock by Size:</strong>
            <ul>
              {Object.entries(selectedProduct.sizes || {}).map(([size, qty]) => (
                <li key={size}>
                  {size}: {qty}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <button
        onClick={handleDelete}
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
          marginTop: "10px",
        }}
      >
        Delete Product
      </button>

      {message && (
        <p style={{ color: "green", marginTop: "10px", textAlign: "center" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default React.memo(DeleteProduct);
