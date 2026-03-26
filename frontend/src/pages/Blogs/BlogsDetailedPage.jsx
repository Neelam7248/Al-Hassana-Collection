import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/blogs/${id}`
      );
      setBlog(res.data);
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <h2>Loading...</h2>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "30px" }}>
      <Link to="/blogs">← Back</Link>

      <h1>{blog.title}</h1>
      <p>{blog.description}</p>
      <hr />
      <p>{blog.content}</p>
    </div>
  );
}

export default BlogDetail;