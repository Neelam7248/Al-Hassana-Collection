// routes/sitemap.js
const express = require("express");
const { SitemapStream, streamToPromise } = require("sitemap");
const Product = require("../models/Products");
const Blog = require("../models/blogs");
const { Discussion } = require("../models/forum");
const { categoriesConfig } = require("../config/CategoriesConfig");

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
  try {
    // ✅ Automatic hostname detection: localhost in dev, your domain in prod
    const hostname =
      process.env.NODE_ENV === "production"
        ? "https://alhassanacollections.com"
        : "http://localhost:3000";

    const smStream = new SitemapStream({ hostname });

    // ✅ Set content type immediately
    res.writeHead(200, { "Content-Type": "application/xml" });

    // 1️⃣ Static pages
    const staticPages = ["/", "/productpage", "/our-story", "/disclaimer", "/blogs", "/forum"];
    staticPages.forEach(url =>
      smStream.write({ url, changefreq: "monthly", priority: 0.7, lastmodISO: new Date().toISOString() })
    );

    // 2️⃣ DB fetch: products, blogs, discussions
    const [products, blogs, discussions] = await Promise.all([
      Product.find({}),
      Blog.find({}),
      Discussion.find({})
    ]);

    products.forEach(p =>
      smStream.write({
        url: `/productdetailpage/${p._id}`,
        changefreq: "weekly",
        priority: 0.9,
        lastmodISO: p.updatedAt.toISOString()
      })
    );

    blogs.forEach(b =>
      smStream.write({
        url: `/blog/${b.slug}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmodISO: b.updatedAt.toISOString()
      })
    );

    discussions.forEach(d =>
      smStream.write({
        url: `/forum/discussion/${d._id}`,
        changefreq: "weekly",
        priority: 0.6,
        lastmodISO: d.updatedAt.toISOString()
      })
    );

    // 3️⃣ Categories / subcategories
    Object.values(categoriesConfig).forEach(c => {
      smStream.write({
        url: `/collections/${c.slug}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmodISO: new Date().toISOString()
      });

      if (c.subCategories)
        Object.values(c.subCategories).forEach(sub =>
          smStream.write({
            url: `/collections/${c.slug}/${sub.slug}`,
            changefreq: "weekly",
            priority: 0.8,
            lastmodISO: new Date().toISOString()
          })
        );
    });

    // ✅ Finish the sitemap stream
    smStream.end();

    // ✅ Convert stream to string and send as XML
    const sitemapOutput = await streamToPromise(smStream).then(sm => sm.toString());
    res.send(sitemapOutput);

    // ✅ Logging without breaking headers
    console.log("Sitemap generated successfully:");
    console.log("Products:", products.length, "Blogs:", blogs.length, "Discussions:", discussions.length);

  } catch (err) {
    console.error("Sitemap generation error:", err);

    // ✅ Only send 500 if headers not already sent
    if (!res.headersSent) {
      res.status(500).send("Internal Server Error");
    }
  }
});

module.exports = router;