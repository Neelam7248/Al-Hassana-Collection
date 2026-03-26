import React from "react";

function Disclaimer() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "40px",
        lineHeight: "1.8",
        fontFamily: "Arial"
      }}
    >
      <h1 style={{ textAlign: "center", color: "#0077b6" }}>
        Disclaimer
      </h1>

      {/* GENERAL */}
      <h2>General Information</h2>
      <p>
        All information on this website is provided in good faith and for general informational purposes only.
        We try our best to ensure accuracy, but we do not guarantee completeness or reliability.
      </p>

      {/* PRODUCT DISCLAIMER (UPDATED) */}
      <h2>Product Disclaimer</h2>
      <p>
        We ensure quality and care in all products, but minor variations may occur as part of manufacturing.
        We encourage customers to handle products with care and understanding.
      </p>

      {/* RELIGIOUS USE */}
      <h2>Religious Use Disclaimer</h2>
      <p>
        Our products are intended to assist in عبادات (worship), but they do not guarantee any spiritual outcomes.
        Acceptance of deeds depends on sincerity (نیت) and the will of Allah.
      </p>

      <p style={{ fontStyle: "italic" }}>
        “Actions are judged by intentions.” (Sahih Bukhari)
      </p>

      {/* LIABILITY */}
      <h2>Limitation of Liability</h2>
      <p>
        We are not responsible for any direct or indirect loss, damage, or issues arising from the use of our website or products.
      </p>

      {/* CONSENT */}
      <h2>Consent</h2>
      <p>
        By using our website, you agree to this disclaimer and its terms.
      </p>

      {/* UPDATE */}
      <h2>Updates</h2>
      <p>
        We may update this disclaimer at any time without prior notice.
      </p>
    </div>
  );
}

export default Disclaimer;