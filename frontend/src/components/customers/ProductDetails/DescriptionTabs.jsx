import React, { useState } from "react";
import "./DescriptionTabs.css";

const DescriptionTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="tabs-wrapper">
      {/* TAB BUTTONS */}
      <div className="tabs-header">
        <button
          className={activeTab === "description" ? "tab active" : "tab"}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>

        <button
          className={activeTab === "notes" ? "tab active" : "tab"}
          onClick={() => setActiveTab("notes")}
        >
          Notes
        </button>

        <button
          className={activeTab === "whatisthis" ? "tab active" : "tab"}
          onClick={() => setActiveTab("whatisthis")}
        >
          What is this?
        </button>

        <button
          className={activeTab === "howtouse" ? "tab active" : "tab"}
          onClick={() => setActiveTab("howtouse")}
        >
          How to Use
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="tabs-content">
        {activeTab === "description" && (
          <div>
            <h3>Product Description</h3>
            <p>
              {product?.description ||
                "This is a premium product designed to give you the best skincare experience."}
            </p>
          </div>
        )}

        {activeTab === "notes" && (
          <div>
            <h3>Notes</h3>
            <p>
              {product?.notes ||
                "This product is suitable for daily use and gives long-lasting results."}
            </p>
          </div>
        )}

        {activeTab === "whatisthis" && (
          <div>
            <h3>What is this?</h3>
            <p>
              {product?.whatIsThis ||
                "This is a specially formulated beauty product made with natural ingredients."}
            </p>
          </div>
        )}

        {activeTab === "howtouse" && (
          <div>
            <h3>How to Use</h3>
            <p>
              {product?.howToUse ||
                "Apply a small amount on clean skin and massage gently for best results."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionTabs;
