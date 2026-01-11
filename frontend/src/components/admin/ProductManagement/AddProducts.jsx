import React, { useState, useContext ,useEffect} from "react";
import { ProductContext } from "./ProductContext";
import "../../customers/CustomerRegister.css";

function AddProduct() {
  const { addProduct } = useContext(ProductContext);
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    realPrice: "",
    discountPrice: "",
    category: "",
    description: "",
    gender: "",
    images: [],
    stock: "",
    sizes: {
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0,
      
    },
    colors:{Red:0,Blue:0,Green:0,Black:0,White:0,Yellow:0,Purple:0,Orange:0,Brown:0,Gray:0},
  });

  const [message, setMessage] = useState("");
const colors = ["SelectedProduct","Red","Blue","Green","Black","White","Yellow","Purple","Orange","Brown","Gray"];
  const categories = ["jackets", "shirts", "t-shirts", "pants","jeans","hoodies","suits","caps"];
  const gender = ["Male"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSizeChange = (size, value) => {
  setFormData({
    ...formData,
    sizes: { ...formData.sizes, [size]: Number(value) },
  });
};


const handleImageChange = (e) => {
  const files = e.target.files;
  const previews = Array.from(files).map(file => URL.createObjectURL(file));
  setFormData({ ...formData, images: files });
  setImagePreviews(previews);
};
const handleColorChange = (color, value) => {
  setFormData({
    ...formData,
    colors: { ...formData.colors, [color]: Number(value) },
  });
};
useEffect(() => {
  return () => imagePreviews.forEach(url => URL.revokeObjectURL(url));
}, [imagePreviews]);





const handleSubmit = (e) => {
  e.preventDefault();

  if (
    !formData.name ||
    !formData.realPrice ||
    !formData.discountPrice ||
    !formData.category ||
    !formData.description ||
    !formData.gender ||
    !formData.images.length
  ) {
    setMessage("⚠️ Please fill all required fields");
    return;
  }

  const data = new FormData();

  data.append("name", formData.name);
  data.append("realPrice", formData.realPrice);
  data.append("discountPrice", formData.discountPrice);
  data.append("category", formData.category);
  data.append("description", formData.description);
  data.append("gender", formData.gender);
  data.append("stock", formData.stock);
  data.append("sizes", JSON.stringify(formData.sizes));
data.append("colors", JSON.stringify(formData.colors));

  for (let i = 0; i < formData.images.length; i++) {
    data.append("images", formData.images[i]);
  }

  addProduct(data);

  setMessage("✅ Product added successfully!");

  // ✅ RESET FORM (andar hi hona chahiye)
  setFormData({
    name: "",
    realPrice: "",
    discountPrice: "",
    category: "",
    description: "",
    gender: "",
    images: [],
    stock: "",
    sizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    colors:{SelectedProduct:0,Red:0,Blue:0,Green:0,Black:0,White:0,Yellow:0,Purple:0,Orange:0,Brown:0,Gray:0}
  });

  setTimeout(() => setMessage(""), 2000);
};

  return (
    <div className="register-page">
      <h2>Add New Product</h2>

      <div className="register-card">
        <form onSubmit={handleSubmit} encType="multipart/form-data">

          {/* Product Name */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* Prices */}
          <input
            type="number"
            name="realPrice"
            placeholder="Real Price (PKR)"
            value={formData.realPrice}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="discountPrice"
            placeholder="Discount Price (PKR)"
            value={formData.discountPrice}
            onChange={handleChange}
            required
          />

          {/* Category */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Description */}
          <input
            type="text"
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          {/* Gender */}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            {gender.map((g, i) => (
              <option key={i} value={g}>
                {g}
              </option>
            ))}
          </select>

         <div>
  <label>Quantity by Size:</label>
  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "5px" }}>
    {sizes.map((s) => (
      <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span>{s}</span>
        <input
          type="number"
          min="0"
          value={formData.sizes[s]}
          onChange={(e) => handleSizeChange(s, e.target.value)}
          style={{ width: "60px", textAlign: "center" }}
        />
      </div>
    ))}
  </div>
</div>

<div>
  <label>Quantity by Color:</label>
  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "5px" }}>
    {colors.map((c) => (
      <div key={c} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span>{c}</span>
        <input
          type="number"
          min="0"
          value={formData.colors[c]}
          onChange={(e) => handleColorChange(c, e.target.value)}
          style={{ width: "60px", textAlign: "center" }}
        />
      </div>
    ))}
  </div>
</div>
<input
  type="file"
  accept="image/*"
  multiple
  onChange={handleImageChange}
/>

          {/* Images */}
    
{imagePreviews.map((src, index) => (
  <img key={index} src={src} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", border: "1px solid #ccc" }}/>
))}

         
          {/* Stock */}
          <input
            type="number"
            name="stock"
            placeholder="Total Stock"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: Number(e.target.value) })
            }
            required
          />

         <button type="submit" disabled={loading}>
  {loading ? "Uploading..." : "Add Product"}
</button>
        </form>

        {message && (
          <p style={{ color: "green", marginTop: "10px" }}>{message}</p>
        )}
      </div>
    </div>
  );
}

export default React.memo(AddProduct);
