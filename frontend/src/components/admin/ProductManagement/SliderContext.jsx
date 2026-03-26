// src/context/SliderContext.js
import { createContext, useState } from "react";
import axios from "axios";
import { getToken } from "../../../utils/auth";

export const SliderContext = createContext();

const backendURL =
  process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";

export const SliderProvider = ({ children }) => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---------------- FETCH SLIDES ----------------
  const fetchSlides = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${backendURL}/api/slides`);
      setSlides(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ---------------- ADD SLIDE ----------------
  const addSlide = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();

      const res = await axios.post(
        `${backendURL}/api/slides`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSlides((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UPDATE SLIDE ----------------
  const updateSlide = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();

      const res = await axios.put(
        `${backendURL}/api/slides/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = res.data;

      setSlides((prev) =>
        prev.map((s) => (s._id === id ? updated : s))
      );

      return updated;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE SLIDE ----------------
  const deleteSlide = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();

      await axios.delete(`${backendURL}/api/slides/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSlides((prev) => prev.filter((s) => s._id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SliderContext.Provider
      value={{
        slides,
        loading,
        error,
        fetchSlides,
        addSlide,
        updateSlide,
        deleteSlide,
      }}
    >
      {children}
    </SliderContext.Provider>
  );
};