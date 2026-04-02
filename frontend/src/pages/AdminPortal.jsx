import React, { useState } from "react";
import ProductManagement from "../components/admin/ProductManagement/ProductManagement";
import OrderManagement from "../components/admin/OrderManagement/OrderManagement";
import CustomerManagement from "../components/admin/CustomerManagement/CustomerManagement";
import AdminCreation from "../components/admin/AdminManagement/CreateAdmin";
import ServiceCharge from "../components/admin/AdminManagement/AddServiceCharges";
import { logout } from "../utils/auth";
import "./AdminPortal.css";
import AddBlog from "../components/admin/Blogs/AddBlogs";
import SeoContent from "../components/admin/SEOContent/SeoContent";

function AdminPortal() {

const [activeTab, setActiveTab] = useState("products");
const [menuOpen, setMenuOpen] = useState(false);

const handleLogout = () => {
  logout();
  window.location.href = "/signin";
};

const tabs = [
  { id: "products", label: "Product Management", component: <ProductManagement /> },
  { id: "orders", label: "Order Management", component: <OrderManagement /> },
  { id: "service-charges", label: "Service Charges", component: <ServiceCharge /> },
  { id: "customers", label: "Customer Management", component: <CustomerManagement /> },
  { id: "analytics", label: "Analytics Dashboard", component: <p style={{color:"red",fontWeight:"bold"}}><i>Coming Soon</i></p> },
  { id: "admin", label: "Admin Management", component: <AdminCreation /> },
  { id: "seo", label: "SEO Content", component: <SeoContent /> },
  { id: "blogs", label: "Blog Management", component: <AddBlog /> }
];

const activeContent = tabs.find(tab => tab.id === activeTab)?.component;

return (
<div className="admin-container">

<h2 className="admin-header">Admin Portal</h2>

{/* Hamburger */}
<div
className="hamburger"
onClick={() => setMenuOpen(!menuOpen)}
>
☰
</div>

<ul className={`admin-nav ${menuOpen ? "show-menu" : ""}`}>

{tabs.map(tab => (
<li
key={tab.id}
className={activeTab === tab.id ? "admin-active-tab" : "admin-tab"}
onClick={() => {
setActiveTab(tab.id);
setMenuOpen(false);
}}
>
{tab.label}
</li>
))}

<li className="admin-logout" onClick={handleLogout}>
Logout
</li>

</ul>

<div className="admin-content">
{activeContent}
</div>

</div>
);
}

export default React.memo(AdminPortal);