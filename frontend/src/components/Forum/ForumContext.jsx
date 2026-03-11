import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth"; // JWT token utility

const ForumContext = createContext();

export const ForumProvider = ({ children }) => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(false);

  const API = axios.create({ baseURL: "http://localhost:5000/api/forum" });

  // Fetch discussions for a subcategory
  const fetchDiscussions = async (categorySlug, subSlug) => {
    setLoading(true);
    try {
      const res = await API.get(`/discussions/${categorySlug}/${subSlug}`);
      setDiscussions(res.data);
      console.log("Fetched discussions:", res.data);
    } catch (err) {
      console.error("Failed to fetch discussions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new discussion (with JWT auth)
  const createDiscussion = async (discussionData) => {
    try {
      const token = getToken();
      if (!token) throw new Error("User not logged in");

      const res = await API.post("/discussions", discussionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
console.log("Discussion created:", res.data);
      return res.data;
    } catch (err) {
      console.error("Failed to create discussion:", err);
      throw err;
    }
  };

  return (
    <ForumContext.Provider
      value={{
        discussions,
        loading,
        fetchDiscussions,
        createDiscussion,
      }}
    >
      {children}
    </ForumContext.Provider>
  );
};

// Custom hook to use context
export const useForum = () => useContext(ForumContext);