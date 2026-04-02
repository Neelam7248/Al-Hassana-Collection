import React, { useState, useContext, useEffect, useRef } from "react";
import { ProductContext } from "./ProductContext";
import "../../customers/CustomerRegister.css";
import { categoriesConfig } from "../../../config/CategoriesConfig";

function EditProduct() {
  const { products, editProduct } = useContext(ProductContext);
  const fileInputRef = useRef(null);

  // ---------------- CONFIG ----------------
  const fragranceSizes = ["2ml","4ml","6ml","12ml","30ml","50ml","100ml"];
  const clothingSizes = ["S","M","L","XL","XXL"];
  const prayerCapSizes = ["54","55","56","57","58"];
  const colors = ["Black","White","Red","Blue","Green","Yellow","Purple","Orange","Brown","Gray"];
  const genderOptions = ["Male","Female","Unisex"];
  const ehramSizes = ["Small (105×210 cm)","Medium (110×220 cm)","Large (115×230 cm)","XL (120×240 cm)"];
  const tasbeehSizes = ["33 Beads","66 Beads","99 Beads","100 Beads"];
  const digitalCounterTypes = ["Standard Digital Counter","Advanced Digital Counter","Premium Digital Counter"];
  const Rosary = ["Wooden Rosary","Plastic Rosary","Beaded Rosary","Metal Rosary"];
  const jaenamazSizes = ["Standard","Large","Travel","Kids"];

  // ---------------- STATE ----------------
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState({
    name:"",
    description:"",
    category:"",
    subCategory:"",
    gender:"",
    variants:[],
    notes:"",
    whatIsThis:"",
    howToUse:""
  });
  const [variant, setVariant] = useState({ size:"", color:"", stock:"", realPrice:"", discountPrice:"" });
  const [imagePreviews, setImagePreviews] = useState([]); // for showing previews
  const [newImages, setNewImages] = useState([]); // Files to upload
  const [existingImages, setExistingImages] = useState([]); // URLs from backend
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- LOAD PRODUCT ----------------
  useEffect(()=>{
    if(!selectedId) return;
    const product = products.find(p => p._id === selectedId);
    if(product){
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        gender: product.gender || "",
        variants: product.variants || [],
        notes: product.notes || "",
        whatIsThis: product.whatIsThis || "",
        howToUse: product.howToUse || ""
      });
      setExistingImages((product.images || []).filter(Boolean));
      setImagePreviews((product.images || []).filter(Boolean));
      setNewImages([]);
      setVariant({ size:"", color:"", stock:"", realPrice:"", discountPrice:"" });
    }
  }, [selectedId, products]);

  // ---------------- SIZE LOGIC ----------------
  const getSizes = () => {
    const { category, subCategory } = formData;
    if(["fragrances","oils"].includes(category)) return fragranceSizes;
    if(category === "clothing") return clothingSizes;
    if(category === "hajj-umrah" && subCategory === "caps") return prayerCapSizes;
    if(category === "hajj-umrah" && ["ehram-men","ehram-women"].includes(subCategory)) return ehramSizes;
    if(category === "hajj-umrah" && subCategory === "jaenamaz") return jaenamazSizes;
    if(category === "tasbeeh" && subCategory === "tasbeeh") return tasbeehSizes;
    if(category === "tasbeeh" && subCategory === "counter-digital") return digitalCounterTypes;
    if(category === "tasbeeh" && subCategory === "rosary") return Rosary;
    return [];
  };

  const hasColors = !["fragrances","oils"].includes(formData.category);

  // ---------------- GENDER LOGIC ----------------
  const genderCategories = ["clothing", "hajj-umrah"];
  const genderRequiredSubCategories = ["ehram-men", "ehram-women"];
  const showGender = genderCategories.includes(formData.category) &&
                     genderRequiredSubCategories.includes(formData.subCategory);

  // ---------------- AUTO COLOR FOR EHRAM/ZAMZAM ----------------
  const isEhram = formData.category === "hajj-umrah" &&
                  ["ehram-men","ehram-women"].includes(formData.subCategory);
  const isZamZamBottle = formData.category === "hajj-umrah" &&
                         formData.subCategory === "zamzam-bottle";

  useEffect(() => {
    if(isEhram || isZamZamBottle){
      setVariant(prev => ({ ...prev, color: "White" }));
    }
  }, [isEhram, isZamZamBottle]);

  // ---------------- VARIANTS ----------------
  const addVariant = () => {
    if(!variant.size || (!variant.color && hasColors) || !variant.stock || !variant.realPrice || !variant.discountPrice){
      setError("Fill all fields");
      return;
    }
    const finalVariant = {
      ...variant,
      color: (isEhram || isZamZamBottle) ? "White" : variant.color
    };
    setFormData(prev => ({ ...prev, variants: [...prev.variants, finalVariant] }));
    setVariant({ size:"", color:"", stock:"", realPrice:"", discountPrice:"" });
    setError("");
  };

  const removeVariant = (i) => {
    setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, idx) => idx !== i) }));
  };

  const editVariant = (i) => {
    const v = formData.variants[i];
    setVariant(v);
    removeVariant(i);
  };

  // ---------------- IMAGES ----------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (i) => {
    const url = imagePreviews[i];
    if(existingImages.includes(url)) {
      setExistingImages(prev => prev.filter(img => img !== url));
    } else {
      setNewImages(prev => prev.filter(f => URL.createObjectURL(f) !== url));
    }
    setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        if(url && typeof url === "string" && url.startsWith("blob:")){
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!selectedId) return alert("Select product");

    if(!formData.name || !formData.category || formData.variants.length === 0){
      setError("Fill all required fields");
      return;
    }

    const data = new FormData();
    data.append("product", JSON.stringify({
      ...formData,
      totalStock: formData.variants.reduce((s,v) => s + Number(v.stock), 0)
    }));

    // Append new files
    newImages.forEach(img => data.append("images", img));

    // Append existing image URLs
    data.append("existingImages", JSON.stringify(existingImages));

    setLoading(true);
    const res = await editProduct(selectedId, data);
    setLoading(false);

    if(res){
      setMessage("Updated ✅");
      setVariant({ size:"", color:"", stock:"", realPrice:"", discountPrice:"" });
      setNewImages([]);
      if(fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setMessage("Failed ❌");
    }
  };

  // ---------------- UI ----------------
  const selectedCategoryKey = Object.keys(categoriesConfig).find(
    key => categoriesConfig[key].slug === formData.category
  );
  const subCategories = selectedCategoryKey
    ? Object.values(categoriesConfig[selectedCategoryKey]?.subCategories || {})
    : [];

  return (
    <div className="register-page">
      <h2>Edit Product</h2>

      <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
        <option value="">Select Product</option>
        {products.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>

      {selectedId && (
        <div className="register-card">
          <form onSubmit={handleSubmit}>
            <input name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name"/>
            <input name="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description"/>
            
            <textarea name="notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Notes"/>
            <textarea name="whatIsThis" value={formData.whatIsThis} onChange={e => setFormData({...formData, whatIsThis: e.target.value})} placeholder="What is this"/>
            <textarea name="howToUse" value={formData.howToUse} onChange={e => setFormData({...formData, howToUse: e.target.value})} placeholder="How to use"/>

            <select name="category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="">Category</option>
              {Object.values(categoriesConfig).map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>

            <select name="subCategory" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})}>
              <option value="">SubCategory</option>
              {subCategories.map(s => <option key={s.slug} value={s.slug}>{s.label}</option>)}
            </select>

            {showGender && (
              <select name="gender" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="">Select Gender</option>
                {genderOptions.map(g => <option key={g}>{g}</option>)}
              </select>
            )}

            <h4>Variant</h4>
            <select value={variant.size} onChange={e => setVariant({...variant, size: e.target.value})}>
              <option value="">Size</option>
              {getSizes().map(s => <option key={s}>{s}</option>)}
            </select>

            {hasColors && !isEhram && !isZamZamBottle && (
              <select value={variant.color} onChange={e => setVariant({...variant, color: e.target.value})}>
                <option value="">Color</option>
                {colors.map(c => <option key={c}>{c}</option>)}
              </select>
            )}

            <input type="number" placeholder="Stock" value={variant.stock} onChange={e => setVariant({...variant, stock: e.target.value})}/>
            <input type="number" placeholder="Real Price" value={variant.realPrice} onChange={e => setVariant({...variant, realPrice: e.target.value})}/>
            <input type="number" placeholder="Discount Price" value={variant.discountPrice} onChange={e => setVariant({...variant, discountPrice: e.target.value})}/>

            <button type="button" onClick={addVariant}>Add Variant</button>

            {formData.variants.map((v,i) => (
              <div key={i}>
                {v.size} {v.color} | {v.stock}
                <button type="button" onClick={() => removeVariant(i)}>X</button>
                <button type="button" onClick={() => editVariant(i)}>Edit</button>
              </div>
            ))}

            <input type="file" multiple ref={fileInputRef} onChange={handleImageChange}/>

            <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
              {imagePreviews.map((src,i) => (
                <div key={i} style={{position:"relative"}}>
                  <img src={src} width={80}/>
                  <button type="button" style={{position:"absolute", top:0, right:0}} onClick={() => removeImage(i)}>X</button>
                </div>
              ))}
            </div>

            <button type="submit">{loading ? "Updating..." : "Update Product"}</button>

            {error && <p style={{color:"red"}}>{error}</p>}
            {message && <p>{message}</p>}
          </form>
        </div>
      )}
    </div>
  );
}

export default React.memo(EditProduct);