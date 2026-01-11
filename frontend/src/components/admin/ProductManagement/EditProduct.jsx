// src/components/admin/ProductManagement/UpdateProduct.jsx
import React, { useState, useContext, useEffect } from "react";
import { ProductContext } from "./ProductContext";
import "../../customers/CustomerRegister.css";

function EditProduct() {
  const { products, editProduct } = useContext(ProductContext);
  const sizes = ["S", "M", "L", "XL", "XXL"];
 const categories = ["jackets", "shirts", "t-shirts", "pants","jeans","hoddies","suits","caps"];
   const genders = ["Male", "Female"];

  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    gender: "",
    sizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    images: [],
  });
  const [preview, setPreview] = useState([]);
  const [message, setMessage] = useState("");

  // Load selected product
  useEffect(() => {
    if (!selectedId) return;
    const product = products.find((p) => p._id === selectedId);
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        gender: product.gender,
        sizes: product.sizes || { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
        images: product.images || [],
      });
      setPreview(product.images || []);
    }
  }, [selectedId, products]);

  // General input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Size change
  const handleSizeChange = (size, value) => {
    setFormData({
      ...formData,
      sizes: { ...formData.sizes, [size]: Number(value) },
    });
  };

  // Image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((images) => {
      setPreview(images);
      setFormData({ ...formData, images });
    });
  };

  // Remove single image
  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setPreview(newImages);
  };

  // Submit updated product
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedId) {
      setMessage("⚠️ Select a product first");
      return;
    }
    editProduct(selectedId, formData);
    setMessage("✅ Product updated successfully!");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="register-page">
      <h3>Update Product</h3>

      {/* Select Product */}
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>
            {p.category},{p.name},Stock :{p.stock}
            
          </option>
        ))}
      </select>

      {selectedId && (
        <div className="register-card">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price (PKR)"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              {genders.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            {/* Sizes */}
            <div className="size-grid">
              <label>Quantity by Size:</label>
              <div className="size-items">
                {sizes.map((s) => (
                  <div key={s} className="size-item">
                    <span>{s}</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.sizes[s]}
                      onChange={(e) =>
                        handleSizeChange(s, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              
            />

            {preview.length > 0 && (
              <div className="image-preview-container"  style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "10px",
              }}>
                {preview.map((img, index) => (
                  <div key={index} className="image-preview">
                    <img src={img} alt={`preview-${index}`}  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}/>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button type="submit">Update Product</button>
          </form>
        </div>
      )}

      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
    </div>
  );
}

export default React.memo(EditProduct);
