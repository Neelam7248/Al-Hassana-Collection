import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductPage from './components/customers/ProductPage';
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
import VerifyEmail from './components/customers/VerifyEmail';
import CreateDiscussionForum from './components/Forum/CreateDiscussionForum';
import ForumHome from './components/Forum/ForumHOme';
import DiscussionsPage from './components/Forum/DiscussionsPage';
import DiscussionPage from './components/Forum/DiscussionPage';
import ScrollToTop from '../src/config/ScrollToTop'; // ✅ Import ScrollToTop component
import OurStory from "./pages/OurStory";
import Disclaimer from "./pages/Disclaimer";
import BlogList from "./pages/Blogs/BlogListPage";
import BlogDetail from "./pages/Blogs/BlogsDetailedPage";
function App() {
  return (
  <>
      <Navbar /> {/* Always visible */}
  <ScrollToTop /> {/* Scroll to top on route change */}
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />
       
        <Route path="/signin" element={<Signin />} />
        <Route path="/productpage" element={<ProductPage />} /> {/* Public page */}
          <Route path="/productdetailpage/:id" element={<ProductDetail />} /> 
<Route path="/collections/:categorySlug" element={<SelectedCategory />}/>

    <Route path="/checkout" element={<CheckoutPage />} />
 <Route path="orders" element={<OrderHistory />} />
 <Route path="/cartpage" element={<CartPage />} />
 <Route path="/profile" element={<Profile />} />
 <Route path="/our-story" element={<OurStory />} />
 <Route path="/disclaimer" element={<Disclaimer />} />

<Route path="/blogs" element={<BlogList />} />
<Route path="/blog/:id" element={<BlogDetail />} />

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



         <Route path="/forum" element={<ForumHome />} />
      <Route path="/forum/new-thread" element={<CreateDiscussionForum />} />
      <Route path="/forum/:category/:subcategory" element={<DiscussionsPage />} />
<Route path="/forum/discussion/:id" element={<DiscussionPage />} />
      </Routes>



    </>  );
}

export default React.memo(App);
