import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch blogs from backend
  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(res.data.blogs);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ Loader
  if (loading) return <p>Loading blogs...</p>;

  return (
    <div>
      <h2>Our Blogs</h2>

      {blogs.length === 0 ? (
        <p>No blogs found</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} style={{ marginBottom: "20px" }}>
            
            <h3>{blog.title}</h3>
            <p>{blog.description}</p>

            {/* Image show */}
            {blog.images && blog.images.length > 0 && (
              <img
                src={blog.images[0]}
                alt={blog.title}
                width="200"
              />
            )}

            {/* 🔥 IMPORTANT: use _id */}
            <Link to={`/blog/${blog._id}`}>
              Read More
            </Link>

          </div>
        ))
      )}
    </div>
  );
}

export default BlogList;