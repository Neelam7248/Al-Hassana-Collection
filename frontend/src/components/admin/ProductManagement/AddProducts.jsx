import React, { useState, useContext, useEffect } from "react";
import { ProductContext } from "./ProductContext";
import "../../customers/CustomerRegister.css";
import { categoriesConfig } from "../../../config/CategoriesConfig";

function AddProduct() {
  const { addProduct } = useContext(ProductContext);
const fragranceSizes = ["2ml", "4ml", "6ml", "12ml", "30ml", "50ml", "100ml"];
const clothingSizes = ["S", "M", "L", "XL", "XXL"];
const prayerCapSizes = ["54", "55", "56", "57", "58"];

  const colors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Brown", "Gray"];
  const genderOptions = ["Male", "Female", "Unisex"];
const ehramMenSizes = [
  "Small (105×210 cm)",
  "Medium (110×220 cm)",
  "Large (115×230 cm)",
  "XL (120×240 cm)"
];
const ehramWomenSizes = [
  "Small (105×210 cm)",
  "Medium (110×220 cm)",
  "Large (115×230 cm)",
  "XL (120×240 cm)"
];

const tasbeehSizes = ["33 Beads", "66 Beads", "99 Beads", "100 Beads"];
const digitalCounterTypes = [
  "Standard Digital Counter",
  "Advanced Digital Counter with Backlight",
  "Premium Digital Counter with Memory Function"
  
];
const Rosary=["Wooden Rosary", "Plastic Rosary", "Beaded Rosary", "Metal Rosary"  ];
const ihramBeltSizes = ["Adjustable"];
const jaenamazSizes = [
  "Standard (70×110 cm)",
  "Large (80×120 cm)",
  "Travel (50×80 cm)",
  "Kids (45×65 cm)"
];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    gender: "",
    variants: [],
    images: []
  });

  const [variant, setVariant] = useState({ size: "", color: "", stock: "", realPrice: "" , discountPrice: "" });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEhram =
  formData.category === "hajj-umrah" &&
  ["ehram-men", "ehram-women"].includes(formData.subCategory);

  const isZamZamBottle =
  formData.category === "hajj-umrah" &&
  ["zamzam-bottle"].includes(formData.subCategory);

useEffect(() => {
  if (isEhram || isZamZamBottle) {
    setVariant(prev => ({
      ...prev,
      color: "White"
    }));
  }
}, [isEhram, isZamZamBottle]);

  
   
 
// used for making the gender visible only for hajj-umrah clothing
// Categories that need gender selection
const genderCategories = ["clothing", "hajj-umrah"];
const genderRequiredSubCategories = ["ehram-men", "ehram-women"];
useEffect(() => {
  // Hide/clear gender if category or subcategory does not require it
  if (
    !formData.category ||
    !genderCategories.includes(formData.category) ||
    !genderRequiredSubCategories.includes(formData.subCategory)
  ) {
    setFormData(prev => ({ ...prev, gender: "" }));
  }
}, [formData.category, formData.subCategory]);
  useEffect(() => {
    return () => imagePreviews.forEach(url => URL.revokeObjectURL(url));
  }, [imagePreviews]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getSizesByCategory = (category, subCategory) => {
  if (!category) return [];

  // For fragrances and oils
  if (["fragrances", "oils"].includes(category)) return fragranceSizes;

  // For Hajj & Umrah Caps
  if (category === "hajj-umrah" && subCategory === "caps") return prayerCapSizes;
// Hajj & Umrah → Ehram ✅
  if (category === "hajj-umrah" && subCategory === "ehram-men") {
    return ehramMenSizes;
  }
  // Hajj & Umrah → Ehram ✅
  if (category === "hajj-umrah" && subCategory === "ehram-women") {
    return ehramWomenSizes;
  }
  if (category === "hajj-umrah" && subCategory === "ihram-belt") {
    return ihramBeltSizes;
  }

  if(category === "hajj-umrah" && subCategory === "zamzam-bottle") {
    return ["250ml","500ml", "1 Liter", "2 Liters"];
  }
if (category === "hajj-umrah" && subCategory === "jaenamaz") {
    return jaenamazSizes;
  }

if (category === "tasbeeh" && subCategory === "tasbeeh-misbah") {
    return tasbeehSizes;
  }
  
if (category === "tasbeeh" && subCategory === "counter-digital") {
    return digitalCounterTypes;
  }
if(category === "tasbeeh" && subCategory === "rosary") {
    return Rosary;
  }
  // For clothing (if you enable it)
  if (category === "clothing") return clothingSizes;

  return [];
};

  const hasColors = !["fragrances", "oils"].includes(formData.category);

  // Add variant
  const addVariant = () => {
  if (!variant.size || !variant.stock || !variant.realPrice  || !variant.discountPrice) {
    setError("⚠️ Please fill all variant fields");
    return;
  }

  const finalVariant = {
    ...variant,
    color: isEhram ? "White" : variant.color
  };

  setFormData({
    ...formData,
    variants: [...formData.variants, finalVariant]
  });

setVariant({
  size: "",
  color: "",
  stock: "",
  realPrice: "",
  discountPrice: "",
});


};

  const handleImageChange = (e) => {
    const files =Array.from(e.target.files);// Convert FileList to Array
    setFormData({ ...formData, images: files });
    setImagePreviews(Array.from(files).map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
const isGenderRequired =
  genderCategories.includes(formData.category) &&
  genderRequiredSubCategories.includes(formData.subCategory);
const hasImages =
  formData.images &&
  typeof formData.images.length === "number" &&
  formData.images.length > 0;

if (
  !formData.name ||
  !formData.description ||
  !formData.category ||
  !formData.subCategory ||
  (isGenderRequired && !formData.gender) ||
  formData.variants.length === 0 ||
  !hasImages
) {
  setError("⚠️ Please fill all required fields and add at least one variant");
  return;
}



    const data = new FormData();
    data.append("product", JSON.stringify({
      ...formData,
      totalStock: formData.variants.reduce((sum, v) => sum + Number(v.stock), 0)
    }));

    formData.images?.forEach(img => data.append("images", img));

    setLoading(true);
    const response = await addProduct(data);
    setLoading(false);


    if (response) {
      setMessage("✅ Product added successfully!");
      setFormData({
        name: "",
        description: "",
        category: "",
        subCategory: "",
        gender: "",
        variants: [],
        images: []
      });
      setImagePreviews([]);

      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("❌ Failed to add product");
    }
  };
const selectedCategoryKey = Object.keys(categoriesConfig).find(
  key => categoriesConfig[key].slug === formData.category
);

const subCategories = selectedCategoryKey
  ? Object.values(categoriesConfig[selectedCategoryKey]?.subCategories || {})
  : [];
const removeVariant = (indexToRemove) => {
  setFormData((prev) => ({
    ...prev,
    variants: prev.variants.filter((_, index) => index !== indexToRemove),
  }));
    setError("");
};
const editVariant = (index) => {
  const v = formData.variants[index];
  setVariant({ ...v });
  setTimeout(() => {
  setError("Variant loaded in form. Edit the fields and click 'Add Variant' to update.");
    removeVariant(index);
}, 200);
}
  const totalStock = formData.variants.reduce((sum, v) => sum + Number(v.stock), 0);

// Remove Variant

  return (
    <div className="register-page">
      <h2>Add New Product</h2>
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
         {genderCategories.includes(formData.category) && 
         genderRequiredSubCategories.includes(formData.subCategory) &&
         (
  <select name="gender" value={formData.gender} onChange={handleChange} required>
    <option value="">Select Gender</option>
    {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
  </select>
)}


          {/* Add Variant */}
          <h4>Add Variant</h4>
          <select value={variant.size} onChange={e => setVariant({ ...variant, size: e.target.value })}>
            <option value="">Select Size/Type</option>
            {getSizesByCategory(formData.category, formData.subCategory).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
{hasColors && !isEhram && !isZamZamBottle && (
  <select
    value={variant.color}
    onChange={e => setVariant({ ...variant, color: e.target.value })}
  >
    <option value="">Select Color</option>
    {colors.map(c => (
      <option key={c} value={c}>{c}</option>
    ))}
  </select>
)}

<label>Stock</label>
          <input type="number" placeholder="Stock" value={variant.stock} onChange={e => setVariant({ ...variant, stock: e.target.value })} />
          
<label>Real Price</label>
          <input type="number" placeholder="Real Price" value={variant.realPrice} onChange={e => setVariant({ ...variant, realPrice: e.target.value })} />
          
<label>Discount Price</label>
          <input type="number" placeholder="Discount Price" value={variant.discountPrice} onChange={e => setVariant({ ...variant, discountPrice: e.target.value })} />

          <button type="button" onClick={addVariant}>Add Variant</button>
        
          {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
          {/* Variant List */}
          <h4>Variants</h4>
           {formData.variants.map((v, i) => (
  <div
    key={i}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "1px solid #ddd",
      padding: "6px 10px",
      borderRadius: "6px",
      marginTop: "6px",
      background: "#fafafa",
    }}
  >
    <span>
      Size: {v.size}{" "}
      Color:{v.color && `| Color: ${v.color}`} | Stock: {v.stock} | Real Price:{" "}
      {v.realPrice} | Discount: {v.discountPrice}
    </span>

    {/* Remove Button */}
    <button
      type="button"
      onClick={() => removeVariant(i)}
      style={{
        background: "red",
        color: "white",
        border: "none",
        padding: "4px 10px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "12px",
      }}
    >
      Remove
    </button>
    
    <button
      type="button"
      onClick={() => editVariant(i)}
      style={{
        background: "#0077b6",
        color: "white",
        border: "none",
        padding: "4px 10px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "12px",
      }}
    >
      Edit
    </button>
  </div>
))}

          <input type="number" value={totalStock} readOnly placeholder="Total Stock" />

          {/* Images */}
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
          <div style={{ display: "flex", gap: 10, marginTop: 5 }}>
            {imagePreviews.map((src, i) => <img key={i} src={src} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", border: "1px solid #ccc" }} />)}
          </div>

          <button type="submit" disabled={loading}>{loading ? "Uploading..." : "Add Product"}</button>
        </form>

        {message && <p style={{ color: message.includes("❌") ? "red" : "green", marginTop: 10 }}>{message}</p>}
      </div>
    </div>
  );
}

export default React.memo(AddProduct);
