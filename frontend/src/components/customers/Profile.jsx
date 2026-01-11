// src/components/customers/Profile.jsx
import React, { useEffect, useContext, useState } from "react";
import { CartContext } from "./CartContext";
import "./Profile.css";

function Profile() {
  const {
    profile,
    profileLoading,
    profileError,
    fetchProfile,
    updateProfile,
  } = useContext(CartContext);

  const [editing, setEditing] = useState(false);    // show/hide form
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Load profile when page opens
  useEffect(() => {
    fetchProfile();
  }, []);

  // When profile loads → put values in form
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile?.name || "",
        phone: profile?.phone || "",
        address: profile?.address || "",
      });
    }
  }, [profile]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setEditing(false); // close form after update
  };

  if (profileLoading) return <p>Loading your profile...</p>;
  if (profileError) return <p style={{ color: "red" }}>{profileError}</p>;
  if (!profile) return null;

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>

      {/* ================== PROFILE INFO ================== */}
      {!editing && (
        <div className="profile-card">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
          <p><strong>Address:</strong> {profile.address || "N/A"}</p>
          <p><strong>User Type:</strong> {profile.userType}</p>

          <button className="btn-update" onClick={() => setEditing(true)}>
            Update Profile
          </button>
        </div>
      )}

      {/* ================== UPDATE FORM ================== */}
      {editing && (
        <form className="profile-form" onSubmit={handleUpdateSubmit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-save">Save Changes</button>

          <button
            type="button"
            className="btn-cancel"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default React.memo(Profile) ;
