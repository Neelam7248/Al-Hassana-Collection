import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { categoriesConfig } from "../../config/CategoriesConfig";
import { useForum } from "./ForumContext";
import "./Forum.css";

const ForumHome = () => {
  const categories = Object.values(categoriesConfig);

  // Context
  const { discussions, fetchDiscussions, loading } = useForum();

  // Fetch discussions for all categories/subcategories (optional)
  useEffect(() => {
    categories.forEach(category => {
      if (category.subCategories) {
        Object.values(category.subCategories).forEach(sub => {
          fetchDiscussions(category.slug, sub.slug);
        });
      }
    });
  }, []); // run once on mount

  // icons for categories
  const categoryIcons = {
    fragrances: "🌸",
    oils: "🧴",
    "hajj-umrah": "🕋"
  };

  // helper function to count discussions for a category
  const countDiscussions = (categorySlug, subSlug) => {
    return discussions.filter(
      d => d.categorySlug === categorySlug && d.subSlug === subSlug
    ).length;
  };

  return (
    <div className="forum-container">

      <h1 className="forum-title">Community Forum</h1>

      <p className="forum-subtitle">
        Ask questions, share experiences and discuss our products.
      </p>

      <Link to="/forum/new-thread" className="new-thread-button">
        + Start New Discussion
      </Link>

      {loading && <p>Loading discussions...</p>}

      <div className="forum-categories">

        {categories.map((category) => (
          <div key={category.slug} className="forum-category-card">

            {/* Category Header */}
            <div className="forum-category-header">

              <div className="forum-icon">
                {categoryIcons[category.slug] || "💬"}
              </div>

              <div>
                <Link
                  to={`/forum/${category.slug}`}
                  className="forum-category-title"
                >
                  {category.label}
                </Link>

                <p className="forum-thread-count">
                  Total discussions: {category.subCategories ? 
                    Object.values(category.subCategories).reduce(
                      (acc, sub) => acc + countDiscussions(category.slug, sub.slug), 0
                    ) : 0
                  }
                </p>
              </div>

            </div>

            {/* Subcategories */}
            <div className="forum-subcategories">
              {category.subCategories &&
                Object.values(category.subCategories)
                  .slice(0, 4)
                  .map((sub) => (
                    <Link
                      key={sub.slug}
                      to={`/forum/${category.slug}/${sub.slug}`}
                      className="forum-sub-link"
                    >
                      {sub.label} ({countDiscussions(category.slug, sub.slug)})
                    </Link>
                  ))
              }

              <Link
                to={`/forum/${category.slug}`}
                className="forum-view-all"
              >
                View all →
              </Link>
            </div>

            {/* Last Activity */}
            <div className="forum-last-activity">
              Last activity: {/* optionally you can fetch latest createdAt from discussions */}
              {discussions.length ? "Today" : "—"}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumHome;