//Not in use in website but this is the component for basic info of product in admin panel
import React from "react";

function BasicInfo({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* PRODUCT NAME */}
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      {/* DESCRIPTION */}
      <input
        type="text"
        name="description"
        placeholder="Product Description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      {/* NOTES */}
      <label>Notes</label>
      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Add notes for this product..."
      />

      {/* WHAT IS THIS */}
      <label>What is this?</label>
      <textarea
        name="whatIsThis"
        value={formData.whatIsThis}
        onChange={handleChange}
        placeholder="Explain what this product is..."
      />

      {/* HOW TO USE */}
      <label>How to Use</label>
      <textarea
        name="howToUse"
        value={formData.howToUse}
        onChange={handleChange}
        placeholder="Instructions for using this product..."
      />
    </>
  );
}

export default React.memo(BasicInfo);