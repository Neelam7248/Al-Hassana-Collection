import React, { useContext, useEffect, useState } from "react";
import { CustomerContext } from "../CustomerManagement/CustomerContext";
import "../../customers/Home.css"; // CSS file for styling
 function CustomerList() {
  const {
    customers,
    loading,
    fetchAllCustomers,
    searchCustomers,
    restoreCustomer,
    deleteCustomer,
  } = useContext(CustomerContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null); 
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchCustomers(value);
  };

  const openProfile = (customer) => {
    setSelectedCustomer(customer);
    setShowProfile(true);
  };

  const closeProfile = () => {
    setSelectedCustomer(null);
    setShowProfile(false);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Customer List</h3>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={handleSearch}
        className="form-control mb-3"
      />

      {loading ? (
        <p>Loading customers...</p>
      ) : customers?.length === 0 ? (
        <p>No customers found</p>
      ) : (
        <div className="customer-card-grid">
          {customers.map((user) => (
            <div className="customer-card" key={user._id}>
              <h5>{user.name}</h5>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={user.isActive ? "active-status" : "deleted-status"}>
                  {user.isActive ? "Active" : "Deleted"}
                </span>
              </p>
              <div className="customer-card-actions">
                <button onClick={() => openProfile(user)}>View</button>
                
                {user.isActive ? (
                  <button
                    className="btn btn-sm btn-danger"
                    disabled={loading}
                    onClick={() => {
                      if (window.confirm("Are you sure you want to soft delete this customer?")) {
                        deleteCustomer(user._id);
                      }
                    }}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-warning"
                    disabled={loading}
                    onClick={() => {
                      if (window.confirm("Are you sure you want to restore this customer?")) {
                        restoreCustomer(user._id);
                      }
                    }}
                  >
                    {loading ? "Restoring..." : "Restore"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROFILE MODAL */}
      {showProfile && selectedCustomer && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedCustomer.name}'s Profile</h5>
                <button type="button" className="btn-close" onClick={closeProfile}></button>
              </div>
              <div className="modal-body">
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                <p><strong>Phone:</strong> {selectedCustomer.phone || "N/A"}</p>
                <p><strong>Address:</strong> {selectedCustomer.address || "N/A"}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedCustomer.isActive ? "Active" : "Deleted"}
                </p>
                <p>
                  <strong>Signup Date:</strong>{" "}
                  {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeProfile}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default React.memo(CustomerList);