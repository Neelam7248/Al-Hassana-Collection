import React, { useState, useContext, useEffect } from "react";
import { ProductContext } from "./ProductContext";
import "../../customers/CustomerRegister.css";
import { categoriesConfig } from "../../../config/CategoriesConfig";

function EditProduct() {
  const { products, editProduct } = useContext(ProductContext);

  const fragranceSizes = ["2ml", "4ml", "6ml", "12ml", "30ml", "50ml", "100ml"];
  const clothingSizes = ["S", "M", "L", "XL", "XXL"];
  const prayerCapSizes = ["54", "55", "56", "57", "58"];
  const colors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Brown", "Gray"];
  const genderOptions = ["Male", "Female", "Unisex"];
  const ehramMenSizes = ["Small (105×210 cm)", "Medium (110×220 cm)", "Large (115×230 cm)", "XL (120×240 cm)"];
  const ehramWomenSizes = ehramMenSizes;
  const tasbeehSizes = ["33 Beads", "66 Beads", "99 Beads", "100 Beads"];
  const digitalCounterTypes = ["Standard Digital Counter", "Advanced Digital Counter with Backlight", "Premium Digital Counter with Memory Function"];
  const Rosary = ["Wooden Rosary", "Plastic Rosary", "Beaded Rosary", "Metal Rosary"];
  const ihramBeltSizes = ["Adjustable"];
  const jaenamazSizes = ["Standard (70×110 cm)", "Large (80×120 cm)", "Travel (50×80 cm)", "Kids (45×65 cm)"];

  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    gender: "",
    variants: [],
    images: []
  });
  const [variant, setVariant] = useState({ size: "", color: "", stock: "", realPrice: "", discountPrice: "" });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load selected product
  useEffect(() => {
    if (!selectedId) return;
    const product = products.find(p => p._id === selectedId);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        subCategory: product.subCategory,
        gender: product.gender || "",
        variants: product.variants || [],
        images: product.images || []
      });
      setImagePreviews(product.images || []);
    }
  }, [selectedId, products]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const isEhram = formData.category === "hajj-umrah" && ["ehram-men", "ehram-women"].includes(formData.subCategory);
  const isZamZamBottle = formData.category === "hajj-umrah" && formData.subCategory === "zamzam-bottle";

  useEffect(() => {
    if (isEhram || isZamZamBottle) {
      setVariant(prev => ({ ...prev, color: "White" }));
    }
  }, [isEhram, isZamZamBottle]);

  const genderCategories = ["clothing", "hajj-umrah"];
  const genderRequiredSubCategories = ["ehram-men", "ehram-women"];
  useEffect(() => {
    if (!formData.category || !genderCategories.includes(formData.category) || !genderRequiredSubCategories.includes(formData.subCategory)) {
      setFormData(prev => ({ ...prev, gender: "" }));
    }
  }, [formData.category, formData.subCategory]);

  useEffect(() => {
    return () => imagePreviews.forEach(url => URL.revokeObjectURL(url));
  }, [imagePreviews]);

  const getSizesByCategory = (category, subCategory) => {
    if (!category) return [];
    if (["fragrances", "oils"].includes(category)) return fragranceSizes;
    if (category === "hajj-umrah" && subCategory === "caps") return prayerCapSizes;
    if (category === "hajj-umrah" && subCategory === "ehram-men") return ehramMenSizes;
    if (category === "hajj-umrah" && subCategory === "ehram-women") return ehramWomenSizes;
    if (category === "hajj-umrah" && subCategory === "ihram-belt") return ihramBeltSizes;
    if (category === "hajj-umrah" && subCategory === "zamzam-bottle") return ["250ml", "500ml", "1 Liter", "2 Liters"];
    if (category === "hajj-umrah" && subCategory === "jaenamaz") return jaenamazSizes;
    if (category === "tasbeeh" && subCategory === "tasbeeh-misbah") return tasbeehSizes;
    if (category === "tasbeeh" && subCategory === "counter-digital") return digitalCounterTypes;
    if (category === "tasbeeh" && subCategory === "rosary") return Rosary;
    if (category === "clothing") return clothingSizes;
    return [];
  };

  const hasColors = !["fragrances", "oils"].includes(formData.category);

  const addVariant = () => {
    if (!variant.size || !variant.stock || !variant.realPrice || !variant.discountPrice) {
      setError("⚠️ Please fill all variant fields");
      return;
    }
    const finalVariant = { ...variant, color: isEhram ? "White" : variant.color };
    setFormData({ ...formData, variants: [...formData.variants, finalVariant] });
    setVariant({ size: "", color: "", stock: "", realPrice: "", discountPrice: "" });
    setError("");
  };

  const removeVariant = (index) => {
    setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
    setError("");
  };

  const editVariant = (index) => {
    const v = formData.variants[index];
    setVariant({ ...v });
    setTimeout(() => removeVariant(index), 200);
  };
  //Remove image (works for both existing URLs and new File objects)
const removeImage = (index) => {
  setImagePreviews(prev => prev.filter((_, i) => i !== index));
  setFormData(prev => ({
    ...prev,
    images: prev.images.filter((_, i) => i !== index)
  }));
};

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const totalStock = formData.variants.reduce((sum, v) => sum + Number(v.stock), 0);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedId) {
    setMessage("⚠️ Select a product first");
    return;
  }

  const response = await editProduct(selectedId, formData);
  if (response) {
    setMessage("✅ Product updated successfully!");
    setTimeout(() => setMessage(""), 2000);
  } else {
    setMessage("❌ Failed to update product");
  }
};

  const selectedCategoryKey = Object.keys(categoriesConfig).find(key => categoriesConfig[key].slug === formData.category);
  const subCategories = selectedCategoryKey ? Object.values(categoriesConfig[selectedCategoryKey]?.subCategories || {}) : [];

  return (
    <div className="register-page">
      <h3>Edit Product</h3>

      <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
        <option value="">Select Product</option>
        {products.map(p => (
          <option key={p._id} value={p._id}>{p.category}, {p.name}, Stock: {p.variants?.reduce((sum, v) => sum + Number(v.stock), 0)}</option>
        ))}
      </select>

      {selectedId && (
        <div className="register-card">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
            <input type="text" name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} required />

            {/* Category */}
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              {Object.entries(categoriesConfig).map(([key, group]) => (
                <option key={key} value={group.slug}>{group.label}</option>
              ))}
            </select>

            {/* SubCategory */}
            <select name="subCategory" value={formData.subCategory} onChange={handleChange} required disabled={!formData.category}>
              <option value="">Select SubCategory</option>
              {subCategories.map(sub => <option key={sub.slug} value={sub.slug}>{sub.label}</option>)}
            </select>

            {/* Gender */}
            {genderCategories.includes(formData.category) && genderRequiredSubCategories.includes(formData.subCategory) && (
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            )}

            {/* Add Variant */}
            <h4>Variants</h4>
            <select value={variant.size} onChange={e => setVariant({ ...variant, size: e.target.value })}>
              <option value="">Select Size/Type</option>
              {getSizesByCategory(formData.category, formData.subCategory).map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {hasColors && !isEhram && !isZamZamBottle && (
              <select value={variant.color} onChange={e => setVariant({ ...variant, color: e.target.value })}>
                <option value="">Select Color</option>
                {colors.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}

            <input type="number" placeholder="Stock" value={variant.stock} onChange={e => setVariant({ ...variant, stock: e.target.value })} />
            <input type="number" placeholder="Real Price" value={variant.realPrice} onChange={e => setVariant({ ...variant, realPrice: e.target.value })} />
            <input type="number" placeholder="Discount Price" value={variant.discountPrice} onChange={e => setVariant({ ...variant, discountPrice: e.target.value })} />
            <button type="button" onClick={addVariant}>Add Variant</button>
            {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

            {/* Variant List */}
            {formData.variants.map((v, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #ddd", padding: "6px 10px", borderRadius: "6px", marginTop: "6px", background: "#fafafa" }}>
                <span>Size: {v.size} {v.color && `| Color: ${v.color}`} | Stock: {v.stock} | Real: {v.realPrice} | Discount: {v.discountPrice}</span>
                <button type="button" onClick={() => removeVariant(i)} style={{ background: "red", color: "white", border: "none", padding: "4px 10px", borderRadius: "5px", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                <button type="button" onClick={() => editVariant(i)} style={{ background: "#0077b6", color: "white", border: "none", padding: "4px 10px", borderRadius: "5px", cursor: "pointer", fontSize: "12px" }}>Edit</button>
              </div>
            ))}

            <input type="number" value={totalStock} readOnly placeholder="Total Stock" />

            {/* Images */}
            {/* Images */}
<input type="file" accept="image/*" multiple onChange={handleImageChange} />

<div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 5 }}>
  {imagePreviews.map((src, i) => (
    <div key={i} style={{ position: "relative", width: 80, height: 80 }}>
      <img
        src={src}
        alt="preview"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      />
      <button
        type="button"
        onClick={() => removeImage(i)}
        style={{
          position: "contain",
          top: 0,
          right:0,
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "2%",
          width: 20,
          height: 20,
          cursor: "pointer",
          fontSize: 12,
          lineHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ×
      </button>
    </div>
  ))}
</div>

            <button type="submit">Update Product</button>
          </form>
        </div>
      )}

      {message && <p style={{ color: message.includes("❌") ? "red" : "green", marginTop: 10 }}>{message}</p>}
    </div>
  );
}

export default React.memo(EditProduct);
