import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import "../../customers/Home.css"; // Apply your CSS

function AdminInventory() {
  const [inventory, setInventory] = useState(null);
const backendURL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(`{backendURL}/api/products/inventory`);
        setInventory(res.data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchInventory();
  }, []);

  if (!inventory) return <p>Loading...</p>;

  return (
    <div className="home-container" style={{ padding: "2px" }}>
      <h2>Admin Inventory Dashboard</h2>
      <p><strong>Total Products:</strong> {inventory.totalProducts}</p>
      <p><strong>Total Stock:</strong> {inventory.totalStock}</p>

      <div className="product-grids">
        {inventory.products.map((product) => (
          <div key={product._id} className="product-card">
            {/* Product Image */}
           <p  className="product-id"> ProductId:<br/>{product._id}
            <br/></p>
    
            {product.images && product.images.length > 0 && (
              <img src={product.images[0]} alt={product.name} />
            )}

            {/* Product Info */}
            <h6>{product.name}</h6>
            <p className="product-price">{product.price} PKR</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Gender:</strong> {product.gender}</p>
            <p>
              <strong>Sizes:</strong>{" "}
              {product.sizes
                ? Object.entries(product.sizes)
                    .map(([size, qty]) => `${size}:${qty}`)
                    .join(", ")
                : "-"}
            </p>
            <p>
              <strong>Total Stock:</strong>{" "}
              {product.sizes
                ? Object.values(product.sizes).reduce((a, b) => a + b, 0)
                : product.stock || 0}
            </p>
            <p>Des:{product.description}</p>

            
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(AdminInventory);
