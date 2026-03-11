import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categoriesConfig } from "../../config/CategoriesConfig";
import { getToken } from "../../utils/auth";
import { useForum } from "./ForumContext";
import "./NewThreadForum.css";

const NewThreadForum = () => {
  const navigate = useNavigate();
  const { createDiscussion } = useForum();
  const categories = Object.values(categoriesConfig);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const subcategories = category ? Object.values(categoriesConfig[category].subCategories) : [];

  // ✅ Check if user is logged in once
  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("You must be logged in to create a discussion!");
      navigate("/signin"); // redirect to login page
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (!token) {
      // No token → user not logged in
      alert("You must be logged in!");
      navigate("/signin");
      return;
    }

    try {
      // Call context function, token is passed in headers inside the function
      await createDiscussion(
        {
          title,
          content,
          categorySlug: category,
          subSlug: subcategory
        },
        token // token is only used in backend to get userId
      );

      // Redirect to the discussions page
      navigate(`/forum/${category}/${subcategory}`);
    } catch (err) {
      // Backend 400 errors now will show meaningful message
      const message = err.response?.data?.message || "Failed to create discussion";
      alert(message);
      console.error(err);
    }
  };

  return (
    <div className="new-thread-container">
      <h2>Create New Discussion</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter clear title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
          />
          <small>Example: "Best floral perfume for summer in Pakistan?" (5–100 characters)</small>
        </div>

        {/* Content */}
        <div className="form-group">
          <textarea
            placeholder="Write details or description of your discussion"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minLength={20}
            maxLength={1000}
            required
          />
          <small>Provide context or question (20–1000 characters)</small>
        </div>

        {/* Category */}
        <div className="form-group">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory("");
            }}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div className="form-group">
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            required
            disabled={!category}
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub.slug} value={sub.slug}>
                {sub.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Create Discussion</button>
      </form>
    </div>
  );
};

export default NewThreadForum;