// src/components/admin/SEOContent/FetchSEOContent.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FetchSEOContent.css";

const FetchSEOContent = ({ category, subCategory }) => {
  const [seoContent, setSeoContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const backendURL = process.env.REACT_APP_API_BACKEND_URL;

  useEffect(() => {
    const fetchSEOContent = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendURL}/api/seo-content/${category}/${subCategory}`);
        setSeoContent(response.data.data);
      } catch (error) {
        console.error("Error fetching SEO content:", error);
      } finally {
        setLoading(false);
      }
    };

    if (category && subCategory) {
      fetchSEOContent();
    }
  }, [category, subCategory, backendURL]);

  return (
    <div className="seo-content-container">
      {loading ? (
        <p className="seo-loading">Loading SEO content...</p>
      ) : seoContent ? (
        <div className="seo-content-card">
          <h1 className="seo-title">{seoContent.title}</h1>
      {/*    <h2 className="seo-emoji">🔍{seoContent.heading}</h2>*/}


          <p className="seo-description"><span className="seo-emoji">📌</span>{seoContent.description}</p>
        </div>
      ) : (
        <p className="seo-not-found">SEO content not found.</p>
      )}
    </div>
  );
};

export default FetchSEOContent;