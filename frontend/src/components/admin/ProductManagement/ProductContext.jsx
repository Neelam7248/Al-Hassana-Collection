// src/components/admin/ProductManagement/ProductContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1); // pagination
  const [limit] = useState(20); // products per page
  const backendURL = process.env.REACT_APP_API_BACKEND_URL;

  // Fetch products on load
  useEffect(() => {
    fetchProducts(page, limit);
  }, [page, limit]);

  // Fetch products with pagination & field selection
  const fetchProducts = async (page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${backendURL}/api/products?page=${page}&limit=${limit}`);
console.log("Fetched products:", res.data);
// Convert filenames to full URLs
const productsWithFullURLs = res.data.map(p => ({
  ...p,
  images: p.images || []
}));
//changed accordingly with cloudinary setup

console.log("Fetched products with URLs:", productsWithFullURLs);

setProducts(productsWithFullURLs);
}catch (err) {
      console.error("Failed to fetch products", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products by category (also paginated)
  // Fetch products by category (also paginated)
const handleCategorySelect = async (category, page = 1, limit = 20) => {
  setLoading(true);
  setError(null);
  try {
    const res = await axios.get(
      `${backendURL}/api/products/byCategory?category=${category}&page=${page}&limit=${limit}`
    );

    const productsWithFullURLs = res.data.map(p => ({
      ...p,
      images: p.images || []   // ✅ Cloudinary URLs 그대로
    }));

    setSelectedCategoryProducts(productsWithFullURLs);
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Failed to fetch category products");
    setSelectedCategoryProducts([]);
  } finally {
    setLoading(false);
  }
};

  // Add product
  const addProduct = async (newProduct) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${backendURL}/api/products/add`, newProduct);
      setProducts((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const editProduct = async (id, updatedProduct) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`${backendURL}/api/products/${id}`, updatedProduct);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? res.data : p))
      );
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${backendURL}/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        selectedCategoryProducts,
        loading,
        error,
        fetchProducts,
        handleCategorySelect,
        addProduct,
        editProduct,
        deleteProduct,
        page,
        setPage,
        limit
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
