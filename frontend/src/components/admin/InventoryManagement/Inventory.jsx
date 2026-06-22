import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../customers/Home.css";
import { getToken } from "../../../utils/auth";

function AdminInventory() {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendURL =
    process.env.REACT_APP_API_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchInventory();
  }, []);


const toggleFeatured = async (
  id,
  currentValue
) => {

  const token = getToken();

  try {

    await axios.put(
      `${backendURL}/api/inventory/products/${id}/featured`,

      {
        isFeatured:
          !currentValue,
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchInventory();

  } catch (error) {

    console.log(error);

    alert(
      "Unable to update featured status"
    );
  }
};
  const fetchInventory = async () => {
    const token = getToken();

    try {
      setLoading(true);

      const res = await axios.get(
        `${backendURL}/api/inventory`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Fetched inventory:", res.data);

      setInventory(res.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading inventory...</p>;
  }

  if (!inventory) {
    return <p>No inventory found.</p>;
  }

  // ===== Dashboard Stats =====

  const totalCategories = [
    ...new Set(
      inventory.products.map(
        (product) => product.category
      )
    ),
  ].length;

  const featuredProducts =
    inventory.products.filter(
      (product) => product.isFeatured
    ).length;

  const lowStockProducts =
    inventory.products.filter((product) => {
      const stock =
        product.variants?.reduce(
          (sum, variant) =>
            sum + variant.stock,
          0
        ) || 0;

      return stock <= 5;
    }).length;

  const totalInventoryValue =
    inventory.products.reduce(
      (sum, product) => {
        const value =
          product.variants?.reduce(
            (s, variant) =>
              s +
              variant.discountPrice *
                variant.stock,
            0
          ) || 0;

        return sum + value;
      },
      0
    );

  return (
    <div
      className="home-container"
      style={{ padding: "15px" }}
    >
      <h2>Admin Inventory Dashboard</h2>

      {/* Dashboard Cards */}

      <div className="inventory-tabs">

        <div className="inventory-tab">
          <h4>Total Products</h4>

          <h2>{inventory.totalProducts}</h2>
        </div>

        <div className="inventory-tab">
          <h4>Total Stock</h4>

          <h2>{inventory.totalStock}</h2>
        </div>

        <div className="inventory-tab">
          <h4>Categories</h4>

          <h2>{totalCategories}</h2>
        </div>

        <div className="inventory-tab">
          <h4>Featured</h4>

          <h2>{featuredProducts}</h2>
        </div>

        <div className="inventory-tab">
          <h4>Low Stock</h4>

          <h2>{lowStockProducts}</h2>
        </div>

        <div className="inventory-tab">
          <h4>Inventory Value</h4>

          <h2>{totalInventoryValue} PKR</h2>
        </div>

      </div>

      {/* Products */}

      <div className="product-grids">

        {inventory.products?.map(
          (product, index) => {
            const totalStock =
              product.variants?.reduce(
                (sum, variant) =>
                  sum + variant.stock,
                0
              ) || 0;

            return (
              <div
                key={product._id}
                className="product-card"
              >
                <p>
                  <strong>
                    Product No:
                  </strong>{" "}
                  {index + 1}
                </p>

                <p className="product-id">
                  <strong>
                    Product Id:
                  </strong>

                  <br />

                  {product._id}
                </p>

                {product.images?.length >
                0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                  />
                ) : (
                  <p>No Image</p>
                )}

                <h4>{product.name}</h4>

                <p>
                  <strong>
                    Category:
                  </strong>{" "}
                  {product.category}
                </p>

                <p>
                  <strong>
                    Sub Category:
                  </strong>{" "}
                  {product.subCategory}
                </p>

                <p>
                  <strong>
                    Gender:
                  </strong>{" "}
                  {product.gender ||
                    "N/A"}
                </p>

                <p>
                  <strong>
                    Featured:
                  </strong>{" "}
                  {product.isFeatured
                    ? "Yes"
                    : "No"}
                </p>

                <p>
                  <strong>
                    Total Stock:
                  </strong>{" "}
                  {totalStock}
                </p>

                <p>
                  <strong>
                    Description:
                  </strong>

                  <br />

                  {
                    product.description
                  }
                </p>

                <h4>Variants</h4>

                {product.variants
                  ?.length > 0 ? (
                  product.variants.map(
                    (
                      variant,
                      index
                    ) => (
                      <div
                        key={index}
                        style={{
                          borderTop:
                            "1px solid lightgray",
                          marginTop:
                            "10px",
                          paddingTop:
                            "10px",
                        }}
                      >
                        <p>
                          <strong>
                            Color:
                          </strong>{" "}
                          {
                            variant.color
                          }
                        </p>

                        <p>
                          <strong>
                            Size:
                          </strong>{" "}
                          {
                            variant.size
                          }
                        </p>

                        <p>
                          <strong>
                            Real Price:
                          </strong>{" "}
                          {
                            variant.realPrice
                          }{" "}
                          PKR
                        </p>

                        <p>
                          <strong>
                            Discount Price:
                          </strong>{" "}
                          {
                            variant.discountPrice
                          }{" "}
                          PKR
                        </p>

                        <p>
                          <strong>
                            Stock:
                          </strong>{" "}
                          {
                            variant.stock
                          }
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p>
                    No variants
                    available
                  </p>
                )}

                <hr />

                <p>
                  <strong>
                    Created By:
                  </strong>{" "}
                  {
                    product.createdByName
                  }
                </p>

                <p>
                  <strong>
                    Email:
                  </strong>{" "}
                  {
                    product.createdByEmail
                  }
                </p>

                <p>
                  <strong>
                    Rating:
                  </strong>{" "}
                  {
                    product.rating
                      ?.average
                  }{" "}
                  ⭐ (
                  {
                    product.rating
                      ?.count
                  }{" "}
                  reviews)

                  <p>
  <strong>Featured:</strong>{" "}

  {product.isFeatured
    ? "Yes ⭐"
    : "No"}
</p>

<button
  className="featured-btn"

  onClick={() =>
    toggleFeatured(
      product._id,

      product.isFeatured
    )
  }
>

  {product.isFeatured
    ? "❌ Remove Featured"
    : "⭐ Make Featured"}

</button>
                </p>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

export default React.memo(AdminInventory);