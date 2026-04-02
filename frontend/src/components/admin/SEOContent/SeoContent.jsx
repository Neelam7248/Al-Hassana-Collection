// src/components/admin/SEOContentForm.js
import React, { useState } from "react";
import axios from "axios";
import { categoriesConfig } from "../../../config/CategoriesConfig";
import "./SEOContent.css"; // import CSS

const backendURL = process.env.REACT_APP_API_BACKEND_URL;

const SEOContentForm = () => {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !subCategory) {
      setMessage("Please select category and subcategory");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${backendURL}/api/seo-content/add`, {
        category,
        subCategory,
        title,
        description,
        keywords: keywords.split(",").map(k => k.trim()), // array
      });

      if (res.data.success) {
        setMessage("SEO content added successfully!");
        setTitle("");
        setDescription("");
        setKeywords("");
        setCategory("");
        setSubCategory("");
      } else {
        setMessage("Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to add SEO content.");
    } finally {
      setLoading(false);
    }
  };

  // Get selected category object from slug
  const selectedCategoryObj = Object.values(categoriesConfig).find(
    (cat) => cat.slug === category
  );

  // Get subcategories from selected category object
  const subCategories = selectedCategoryObj
    ? Object.values(selectedCategoryObj.subCategories || {})
    : [];

  return (
    <div className="seo-form-container">
      <h2 className="seo-form-title">Add SEO Content</h2>
      <form className="seo-form" onSubmit={handleSubmit}>
        {/* Category */}
        <div className="form-group">
          <label>Parent Category:</label>
          <select
            className="form-input"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory(""); // reset subcategory
            }}
            required
          >
            <option value="">Select Category</option>
            {Object.values(categoriesConfig).map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div className="form-group">
          <label>Subcategory:</label>
          <select
            className="form-input"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            required
            disabled={!category}
          >
            <option value="">Select Subcategory</option>
            {subCategories.map((sub) => (
              <option key={sub.slug} value={sub.slug}>
                {sub.label}
              </option>
            ))}
          </select>
        </div>

        {/* SEO Title */}
        <div className="form-group">
          <label>SEO Title:</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* SEO Description */}
        <div className="form-group">
          <label>SEO Description:</label>
          <textarea
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          ></textarea>
        </div>

        {/* SEO Keywords */}
        <div className="form-group">
          <label>SEO Keywords (comma separated):</label>
          <input
            type="text"
            className="form-input"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? "Saving..." : "Add SEO Content"}
        </button>
      </form>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default SEOContentForm;