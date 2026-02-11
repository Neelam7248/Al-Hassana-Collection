// src/components/admin/ProductManagement/ProductContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../utils/auth";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1); // pagination
  const [limit] = useState(20); // products per page

  const backendURL = process.env.REACT_APP_API_BACKEND_URL;

  // 🔹 Cleanup: jab provider unmount ho
  useEffect(() => {
    return () => setSelectedCategoryProducts([]);
  }, []);

  // 🔹 Fetch all products (general products)
  const fetchProducts = async (page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${backendURL}/api/products?page=${page}&limit=${limit}`);
      const productsWithFullURLs = res.data.map(p => ({
        ...p,
        images: p.images || [],
      }));
      console.log("Fetched products:", productsWithFullURLs);
      setProducts(productsWithFullURLs);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch products by category (slug based)
  const handleCategorySelect = async (subCategorySlug, page = 1, limit = 20) => {
  setSelectedCategoryProducts([]); // reset before fetch
  setLoading(true);
  setError(null);
  try {
    const res = await axios.get(`${backendURL}/api/products/byCategory`, {
      params: { subCategory: subCategorySlug, page, limit }, // ✅ send subCategory slug only
    });
    setSelectedCategoryProducts(
      res.data.map(p => ({
        ...p,
        images: p.images || [],
      }))
    );
  } catch (err) {
    console.error("Failed to fetch category products", err);
    setError("Failed to fetch products");
  } finally {
    setLoading(false);
  }
};

  // 🔹 Add product
 // ProductContext.js
const addProduct = async (formData) => {
  setLoading(true);
  setError(null);
  try {
    const res = await axios.post(`${backendURL}/api/products/add`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        // DON'T set Content-Type manually, Axios will handle it
      },
    });

    console.log("Product added:", res.data);
    setProducts(prev => [res.data.product, ...prev]); // Use res.data.product
    return res.data.product; // return the product object
  } catch (err) {
    console.error("Error adding product:", err.response?.data || err.message);
    setError(err.response?.data?.message || err.message);
    return null;
  } finally {
    setLoading(false);
  }
};

  // 🔹 Edit product
const editProduct = async (id, updatedProduct) => {
  setLoading(true);
  setError(null);
  try {
    const res = await axios.put(
      `${backendURL}/api/products/${id}`,
      updatedProduct,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );

    const updated = res.data.product;

    setProducts(prev => prev.map(p => (p._id === id ? updated : p)));

    return updated; // ✅ return the updated product so component knows
  } catch (err) {
    console.error("Error updating product:", err);
    setError(err.response?.data?.message || err.message);
    return null; // ✅ return null on failure
  } finally {
    setLoading(false);
  }
};

  // 🔹 Delete product
  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${backendURL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Pagination / general fetch
  useEffect(() => {
    // Only fetch all products if no category is selected
    if (selectedCategoryProducts.length === 0) {
      fetchProducts(page, limit);
    }
  }, [page, limit]);

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
        limit,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
