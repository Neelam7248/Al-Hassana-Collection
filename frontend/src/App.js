import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductPage from './components/customers/Products';
import CustomerRegister from './components/customers/CustomersRegister';
import Navbar from './components/Navbar';
import Signin from './components/Signin';
import AdminPortal from './pages/AdminPortal';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ Import protected route
import Home from './components/customers/HomePage';
import ProductDetail from './components/customers/ProductDetailPage';
import SelectedCategory from './components/customers/SelectedCategory';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './components/customers/CartPage';
import OrderHistory from './components/customers/OrderHistory';
import Profile from './components/customers/Profile';
import ForgotPassword from './components/customers/ForgetPassword';
import ContactUs from './components/customers/ContactUs';
function App() {
  return (
  <>
      <Navbar /> {/* Always visible */}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/productpage" element={<ProductPage />} /> {/* Public page */}
          <Route path="/productpage/:id" element={<ProductDetail />} /> 
<Route path="/selectedCategory"element={<SelectedCategory/>}/>
 <Route path="/checkout" element={<CheckoutPage />} />
 <Route path="orders" element={<OrderHistory />} />
 <Route path="/cartpage" element={<CartPage />} />
 <Route path="/profile" element={<Profile />} />
 <Route path="/about" element={<ContactUs />} />
 
 <Route path="/forgetpassword" element={<ForgotPassword />} />

        {/* Admin-only Protected Route */}
        <Route
          path="/adminportal"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminPortal />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>  );
}

export default React.memo(App);
