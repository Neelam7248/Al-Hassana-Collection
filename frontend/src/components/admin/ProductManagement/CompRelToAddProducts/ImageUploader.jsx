import React, { useState, useEffect } from "react";

function ImageUploader({ onImagesChange, fileInputRef }) {
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // parent ko send karo
    onImagesChange(files);

    // preview create
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };

  // cleanup memory
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleImageChange}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 5 }}>
        {imagePreviews.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="preview"
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              border: "1px solid #ccc",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageUploader;