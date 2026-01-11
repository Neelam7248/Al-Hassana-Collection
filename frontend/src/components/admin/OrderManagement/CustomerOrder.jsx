import React, { useState, useContext } from "react";
import { OrderContext } from "./OrderContext";
import UserOrders from "./UserOrder";
console.log(UserOrders);
 function CustomerDetails() {
  const { fetchUserOrders } = useContext(OrderContext);
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() !== "") {
      setSubmittedEmail(email.trim());
      fetchUserOrders(email.trim()); // call context function
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary mb-4">Customer Orders Lookup</h2>

      {/* Email Input Form */}
      <form onSubmit={handleSubmit} style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="email"
          placeholder="Enter customer email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "8px 12px", width: "300px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          required
        />
        <button type="submit" className="btn btn-primary">
          Fetch Orders
        </button>
      </form>

      {/* Display Orders */}
      {submittedEmail && <UserOrders email={submittedEmail} />}
    </div>
  );
}
export default React.memo(CustomerDetails);