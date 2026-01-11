import React,{ useState } from "react";
import ProductManagement from "../components/admin/ProductManagement/ProductManagement";
import OrderManagement from "../components/admin/OrderManagement/OrderManagement";
import CustomerManagement from "../components/admin/CustomerManagement/CustomerManagement";
//import AnalyticsDashboard from "./AnalyticsDashboard";
import { getToken, logout } from "../utils/auth";
import AdminCreation from "../components/admin/AdminManagement/CreateAdmin";
function AdminPortal() {
  const [activeTab, setActiveTab] = useState("products");

  const handleLogout = () => {
    logout();
    window.location.href = "/signin";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <ProductManagement />;
      case "orders":
        return <OrderManagement />;
      case "customers":
        return <CustomerManagement />;
       case "analytics":
         return <p style={{color:"red", fontSize:"Bold" ,fontFamily:"emoji"}}><i>Comming Soon</i></p>;
      case "admin":
        return <AdminCreation />;
     
        return <ProductManagement />;
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Admin Portal</h2>
      <ul style={styles.nav}>
        <li
          style={activeTab === "products" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("products")}
        >
          Product Management
        </li>
        <li
          style={activeTab === "orders" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("orders")}
        >
          Order Management
        </li>
        <li
          style={activeTab === "customers" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("customers")}
        >
          Customer Management
        </li>
        <li
          style={activeTab === "analytics" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics Dashboard
        </li>
        <li
          style={activeTab === "admin" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("admin")}
        >
          Admin Management
        </li>
      
        <li style={styles.logout} onClick={handleLogout}>
          Logout
        </li>
      </ul>

      <div style={styles.content}>{renderContent()}</div>

      {/* Media Queries */}
      <style>{`
        @media (max-width: 768px) {
          ul {
            flex-direction: column;
            align-items: center;
          }
          li {
            padding: 8px 12px;
            margin-bottom: 5px;
          }
          div[style*="width: 80%"] {
            width: 95% !important;
            padding: 15px !important;
          }
        }
        @media (max-width: 480px) {
          h2 {
            font-size: 20px;
          }
          li {
            font-size: 14px;
            padding: 6px 10px;
          }
          div[style*="width: 80%"] {
            padding: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    width: "80%",
    margin: "auto",
    textAlign: "center",
    marginTop: "30px",
    background: "#f8f9fa",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
  },
  header: {
    color: "#0077b6",
  },
  nav: {
    display: "flex",
    justifyContent: "space-around",
    listStyle: "none",
    padding: "10px 0",
    background: "#0077b6",
    borderRadius: "8px",
    flexWrap: "wrap",
  },
  tab: {
    color: "#fff",
    cursor: "pointer",
    padding: "10px 15px",
  },
  activeTab: {
    color: "#0077b6",
    backgroundColor: "#fff",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  logout: {
    color: "#ffdddd",
    cursor: "pointer",
    padding: "10px 15px",
  },
  content: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
  },
};

export default React.memo(AdminPortal);
