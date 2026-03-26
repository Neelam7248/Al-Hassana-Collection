import React, { useContext, useEffect, useState } from "react";
import { SliderContext } from "../ProductManagement/SliderContext";
import { ProductContext } from "../ProductManagement/ProductContext";
import { categoriesConfig } from "../../../config/CategoriesConfig";
import "./AddHeroSlider.css";

const AdminSlider = () => {
  const {
    slides,
    fetchSlides,
    addSlide,
    deleteSlide,
    loading,
  } = useContext(SliderContext);

  const { products } = useContext(ProductContext);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    link: "",
    productId: "",
    image: null,
  });

  // ---------------- FETCH ON LOAD ----------------
  useEffect(() => {
    fetchSlides();
  }, []);

  // ---------------- HANDLE INPUT ----------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ---------------- ADD SLIDE ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.image) {
      alert("Title and Image required!");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);

    // SMART LINK LOGIC
    data.append(
      "link",
      formData.productId
        ? `/productdetailpage/${formData.productId}`
        : formData.link
    );

    data.append("productId", formData.productId);
    data.append("image", formData.image);

    const res = await addSlide(data);

    if (res) {
      setFormData({
        title: "",
        subtitle: "",
        link: "",
        productId: "",
        image: null,
      });
    }
  };

  // ---------------- DELETE SLIDE ----------------
  const handleDelete = async (id) => {
    if (window.confirm("Delete this slide?")) {
      await deleteSlide(id);
    }
  };

  return (
    <div className="admin-slider-container">
      <h2>📷 Admin Slider Management</h2>

      {/* ---------------- FORM ---------------- */}
      <form onSubmit={handleSubmit} className="slider-form">

        <input
          type="text"
          name="title"
          placeholder="Slide Title"
          value={formData.title}
          onChange={handleChange}
        />

        <input
          type="text"
          name="subtitle"
          placeholder="Slide Subtitle"
          value={formData.subtitle}
          onChange={handleChange}
        />

        {/* CATEGORY LINK */}
        <select
          name="link"
          value={formData.link}
          onChange={handleChange}
        >
          <option value="">Select Category</option>

          {Object.values(categoriesConfig).map((cat) => (
            <React.Fragment key={cat.slug}>
              <option value={`/category/${cat.slug}`}>
                {cat.label}
              </option>

              {cat.subCategories &&
                Object.values(cat.subCategories).map((sub) => (
                  <option
                    key={sub.slug}
                    value={`/category/${sub.slug}`}
                  >
                    {cat.label} / {sub.label}
                  </option>
                ))}
            </React.Fragment>
          ))}
        </select>

        {/* PRODUCT SELECT */}
        <select
          name="productId"
          value={formData.productId}
          onChange={handleChange}
        >
          <option value="">Select Product (Optional)</option>

          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* IMAGE */}
        <input
          type="file"
          name="image"
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Slide"}
        </button>
      </form>

      {/* ---------------- SLIDE LIST ---------------- */}
      <div className="slider-list">
        {slides.map((slide) => (
          <div key={slide._id} className="slider-card">

            <img src={slide.imageUrl} alt={slide.title} />

            <h4>{slide.title}</h4>
            <p>{slide.subtitle}</p>

            <small>{slide.link}</small>

            <button onClick={() => handleDelete(slide._id)}>
              Delete
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(AdminSlider);