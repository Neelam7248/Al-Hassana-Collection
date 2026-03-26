import React, { useState, useRef } from "react";
import axios from "axios";
import { blogsConfig } from "../../../config/BlogsConfig";

function AddBlog() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    tags: [],
    slug: ""
  });

  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef(null);

  // =========================
  // SLUG GENERATOR
  // =========================
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

  // =========================
  // INPUT HANDLER
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "title") {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
  };

  // =========================
  // CATEGORY SELECT (BLOG CONFIG)
  // =========================
  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    const config = blogsConfig[selected];

    setForm({
      ...form,
      category: selected,
      title: config?.seo?.title || "",
      description: config?.seo?.description || "",
      slug: config?.slug || ""
    });
  };

  // =========================
  // TAG ADD SYSTEM
  // =========================
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const value = tagInput.trim();

      if (value && !form.tags.includes(value)) {
        setForm((prev) => ({
          ...prev,
          tags: [...prev.tags, value]
        }));
      }

      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag)
    }));
  };

  // =========================
  // IMAGE UPLOAD
  // =========================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const removeImages = () => {
    setImages([]);
    setPreviews([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  // =========================
  // SUBMIT BLOG
  // =========================
  const addBlog = async () => {
    if (!form.title || !form.content) {
      alert("Title aur Content required hain");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", form.title);
      data.append("description", form.description);
      data.append("content", form.content);
      data.append("category", form.category);
      data.append("slug", form.slug);
      data.append("tags", JSON.stringify(form.tags));

      // images
      images.forEach((img) => {
        data.append("images", img);
      });

      await axios.post("http://localhost:5000/api/blogs/add", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Blog Added Successfully!");

      // RESET
      setForm({
        title: "",
        description: "",
        content: "",
        category: "",
        tags: [],
        slug: ""
      });

      setTagInput("");
      removeImages();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Error adding blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "auto" }}>
      <h2>📝 SEO Blog Admin Panel</h2>

      {/* CATEGORY */}
      <select value={form.category} onChange={handleCategoryChange}>
        <option value="">Select Category</option>

        {Object.keys(blogsConfig || {}).map((key) => (
          <option key={key} value={key}>
            {blogsConfig[key].label}
          </option>
        ))}
      </select>

      {/* TITLE */}
      <input
        name="title"
        placeholder="Blog Title"
        value={form.title}
        onChange={handleChange}
      />

      {/* DESCRIPTION */}
      <input
        name="description"
        placeholder="Short Description"
        value={form.description}
        onChange={handleChange}
      />

      {/* SLUG */}
      <input
        name="slug"
        placeholder="SEO Slug"
        value={form.slug}
        onChange={handleChange}
      />

      {/* CONTENT */}
      <textarea
        name="content"
        placeholder="Blog Content"
        value={form.content}
        onChange={handleChange}
        rows={8}
      />

      {/* TAG INPUT */}
      <input
        placeholder="Add tag & press Enter"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleTagKeyDown}
      />

      {/* TAGS DISPLAY */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {form.tags.map((tag, i) => (
          <span
            key={i}
            onClick={() => removeTag(tag)}
            style={{
              padding: "5px 10px",
              background: "#eee",
              borderRadius: 20,
              cursor: "pointer"
            }}
          >
            #{tag} ❌
          </span>
        ))}
      </div>

      {/* IMAGE */}
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileRef}
        onChange={handleImageChange}
      />

      {/* PREVIEW */}
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        {previews.map((src, i) => (
          <img
            key={i}
            src={src}
            style={{
              width: 80,
              height: 80,
              objectFit: "cover"
            }}
          />
        ))}
      </div>

      {previews.length > 0 && (
        <button onClick={removeImages}>Remove Images</button>
      )}

      {/* SUBMIT */}
      <button onClick={addBlog} disabled={loading}>
        {loading ? "Uploading..." : "Publish Blog"}
      </button>
    </div>
  );
}

export default AddBlog;