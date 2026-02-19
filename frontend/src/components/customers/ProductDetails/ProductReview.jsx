import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductsReviews.css";
import { getToken } from "../../../utils/auth";
const BACKEND_URL = process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";

// Render star ratings (can be interactive for the form)
const renderStars = (rating, interactive = false, onHover, onClick) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`star ${i <= rating ? "full" : "empty"}`}
        onMouseEnter={() => interactive && onHover(i)}
        onMouseLeave={() => interactive && onHover(0)}
        onClick={() => interactive && onClick(i)}
        style={{ cursor: interactive ? "pointer" : "default" }}
      >
        &#9733;
      </span>
    );
  }
  return stars;
};
const token=getToken();
function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [images, setImages] = useState([]);
const[breakdown,setBreakdown]=useState([]);
const[average,setAverage]=useState([]);
  // Fetch reviews from backend
useEffect(() => {
  if (!productId) return; // ✅ wait

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/reviews/${productId}`
      );
      console.log("reviews",res.data);
      
      setReviews(res.data.items);
    } catch (err) {
  console.log("Axios full error:", err);

  if (err.response) {
    console.log("Backend status:", err.response.status);
    console.log("Backend data:", err.response.data);
    alert("Backend error: " + err.response.data.error);
  } else {
    console.log("Other error:", err.message);
  }
}

  };

  fetchReviews();
}, [productId]);

  // Submit review
  const handleSubmit = async () => {

    const token = getToken();
    if (!name || !rating || !content) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();

    formData.append("productId", productId);
    formData.append("name", name);
    formData.append("rating", rating);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("youtubeUrl", youtubeUrl);

    images.forEach((file) => formData.append("images", file));

    try {
      const res = await axios.post(`${BACKEND_URL}/api/reviews`, formData, {
        headers: { "Content-Type": "multipart/form-data" ,
            Authorization: `Bearer ${token}` // <-- add this

        },
          
      });
      // ✅ Add new review to state without wiping old ones
    setReviews((prev) => [res.data.review, ...prev]);
 setShowForm(false);
      // Reset form
      setName("");
      setRating(0);
      setHoverRating(0);
      setTitle("");
      setContent("");
      setYoutubeUrl("");
      setImages([]);
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Failed to submit review.");
    }
  };

  // Compute average rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="product-reviews">
      {/* Top bar with average rating */}
      <div className="reviews-top-bar">
        <div className="reviews-summary">
          <div className="rating-value">{averageRating}</div>
          <div className="review-count">{reviews.length} Reviews</div>
        </div>
        <div className="reviews-stars-center">
          <h4>Customer Reviews</h4>
          <div>{renderStars(Math.round(averageRating))}</div>
        </div>
        <div className="reviews-action">
          <button className="write-review-btn" onClick={() => setShowForm(true)}>
            Write a Review
          </button>
        </div>
      </div>

      {/* Review List */}
      <div className="review-list">
        {reviews.map((r, idx) => (
          <div key={idx} className="review-item">
            <div className="review-user">{r.name}</div>
            <div className="review-stars">{renderStars(r.rating)}</div>
            {r.title && <div className="review-title">{r.title}</div>}
            <div className="review-text">{r.content}</div>
          {r.images && r.images.map((url, i) => (
  <img key={i} src={url} alt={`review ${i+1}`} className="review-media" />
))}
  {r.youtubeUrl && (
              <a href={r.youtubeUrl} target="_blank" rel="noreferrer" className="review-youtube">
                YouTube link
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="review-form-modal">
          <div className="review-form-content">
            <h3>Write Your Review</h3>

            <label>Rating*</label>
            <div className="star-selector">
              {renderStars(hoverRating || rating, true, setHoverRating, setRating)}
            </div>

            <label>Review Title (optional)</label>
            <input
              type="text"
              placeholder="Give your review a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>Review Content*</label>
            <textarea
              rows={4}
              placeholder="Start writing here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <label>Upload Images (optional)</label>
            <input
              type="file"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files))}
            />

            <label>YouTube URL (optional)</label>
            <input
              type="text"
              placeholder="https://youtube.com/..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />

            <label>Your Name*</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

            <div className="review-form-buttons">
              <button className="submit-btn" onClick={handleSubmit}>
                Submit
              </button>
              <button className="cancel-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductReviews;
