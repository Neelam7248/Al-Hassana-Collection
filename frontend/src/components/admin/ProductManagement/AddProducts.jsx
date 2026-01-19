import React, { useState, useContext, useEffect } from "react";
import { ProductContext } from "./ProductContext";
import "../../customers/CustomerRegister.css";
import { categoriesConfig } from "../../../config/CategoriesConfig";

function AddProduct() {
  const { addProduct } = useContext(ProductContext);

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = [
    "SelectedProduct","Red","Blue","Green","Black","White",
    "Yellow","Purple","Orange","Brown","Gray"
  ];
  const genderOptions = ["Male", "Female", "Unisex"];

  const [formData, setFormData] = useState({
    name: "",
    realPrice: "",
    discountPrice: "",
    category: "",
    subCategory: "",
    description: "",
    gender: "",
    stock: 0,
    sizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    colors: { SelectedProduct:0, Red:0, Blue:0, Green:0, Black:0, White:0, Yellow:0, Purple:0, Orange:0, Brown:0, Gray:0 },
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Cleanup image URLs to prevent memory leaks
  useEffect(() => {
    return () => imagePreviews.forEach(url => URL.revokeObjectURL(url));
  }, [imagePreviews]);

  // General input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const calculateTotalStock = (sizes) => {
  return Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
};
const handleSizeChange = (size, value) => {
  const updatedSizes = {
    ...formData.sizes,
    [size]: Number(value),
  };

  const totalStock = calculateTotalStock(updatedSizes);

  setFormData({
    ...formData,
    sizes: updatedSizes,
    stock: totalStock, // 🔥 auto sync
  });
};


  const handleColorChange = (color, value) => {
    setFormData({ ...formData, colors: { ...formData.colors, [color]: Number(value) } });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const previews = Array.from(files).map(file => URL.createObjectURL(file));
    setFormData({ ...formData, images: files });
    setImagePreviews(previews);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData({ ...formData, category: selectedCategory, subCategory: "" });
  };

  const handleSubCategoryChange = (e) => {
    setFormData({ ...formData, subCategory: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.realPrice || !formData.discountPrice ||
        !formData.category || !formData.subCategory || !formData.description ||
        !formData.gender || !formData.images.length) {
      setMessage("⚠️ Please fill all required fields");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("realPrice", formData.realPrice);
    data.append("discountPrice", formData.discountPrice);
    data.append("category", formData.category);
    data.append("subCategory", formData.subCategory);
    data.append("description", formData.description);
    data.append("gender", formData.gender);
    data.append("stock", formData.stock);
    data.append("sizes", JSON.stringify(formData.sizes));
    data.append("colors", JSON.stringify(formData.colors));

    for (let i = 0; i < formData.images.length; i++) {
      data.append("images", formData.images[i]);
    }

    setLoading(true);
    const response = await addProduct(data);
    setLoading(false);

    if (response) {
      setMessage("✅ Product added successfully!");
      setFormData({
        name: "",
        realPrice: "",
        discountPrice: "",
        category: "",
        subCategory: "",
        description: "",
        gender: "",
        stock: 0,
        sizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
        colors: { SelectedProduct:0, Red:0, Blue:0, Green:0, Black:0, White:0, Yellow:0, Purple:0, Orange:0, Brown:0, Gray:0 },
        images: [],
      });
      setImagePreviews([]);
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("❌ Failed to add product");
    }
  };

  // Get subcategories of selected category
  const subCategories = formData.category
    ? Object.values(categoriesConfig[Object.keys(categoriesConfig).find(key => categoriesConfig[key].label === formData.category)].subCategories)
    : [];

  return (
    <div className="register-page">
      <h2>Add New Product</h2>
      <div className="register-card">
        <form onSubmit={handleSubmit} encType="multipart/form-data">

          <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />

          <input type="number" name="realPrice" placeholder="Real Price (PKR)" value={formData.realPrice} onChange={handleChange} required />

          <input type="number" name="discountPrice" placeholder="Discount Price (PKR)" value={formData.discountPrice} onChange={handleChange} required />

          {/* Category */}
          <select name="category" value={formData.category} onChange={handleCategoryChange} required>
            <option value="">Select Category</option>
            {Object.entries(categoriesConfig).map(([groupKey, group]) => (
              <option key={groupKey} value={group.label}>{group.label}</option>
            ))}
          </select>

          {/* SubCategory */}
          <select name="subCategory" value={formData.subCategory} onChange={handleSubCategoryChange} required disabled={!formData.category}>
            <option value="">Select SubCategory</option>
            {subCategories.map((sub) => (
              <option key={sub.slug} value={sub.label}>{sub.label}</option>
            ))}
          </select>

          {/* Description */}
          <input type="text" name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} required />

          {/* Gender */}
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>

          {/* Sizes */}
          <div>
            <label>Quantity by Size:</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "5px" }}>
              {sizes.map((s) => (
                <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span>{s}</span>
                  <input type="number" min="0" value={formData.sizes[s]} onChange={(e) => handleSizeChange(s, e.target.value)} style={{ width: "60px", textAlign: "center" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label>Quantity by Color:</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "5px" }}>
              {colors.map((c) => (
                <div key={c} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span>{c}</span>
                  <input type="number" min="0" value={formData.colors[c]} onChange={(e) => handleColorChange(c, e.target.value)} style={{ width: "60px", textAlign: "center" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
          <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
            {imagePreviews.map((src, i) => <img key={i} src={src} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", border: "1px solid #ccc" }} />)}
          </div>
    <input
  type="number"
  name="stock"
  value={formData.stock}
  readOnly
  placeholder="Total Stock (Auto)"
/>

        
          <button type="submit" disabled={loading}>{loading ? "Uploading..." : "Add Product"}</button>
        
    
        </form>

        {message && <p style={{ color: message.includes("❌") ? "red" : "green", marginTop: "10px" }}>{message}</p>}
      </div>
    </div>
  );
}

export default React.memo(AddProduct);
