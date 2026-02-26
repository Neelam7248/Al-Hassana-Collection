import { useEffect } from "react";

const useSEO = ({
  title,
  description,
  keywords,
  image,
  url,
}) => {
  useEffect(() => {
    // ✅ Title
    if (title) {
      document.title = title;
    }
    
    const updateCanonical = (url) => {
  if (!url) return;

  let link = document.querySelector("link[rel='canonical']");
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
};

updateCanonical(url);

    // Helper function to update or create meta tag
    const updateMetaTag = (name, content, property = false) => {
      if (!content) return;

      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;

      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement("meta");
        if (property) {
          element.setAttribute("property", name);
        } else {
          element.setAttribute("name", name);
        }
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // ✅ Basic SEO
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // ✅ Open Graph (Facebook / WhatsApp)
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", image, true);
    updateMetaTag("og:url", url, true);
    updateMetaTag("og:type", "website", true);

    // ✅ Twitter Card
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);

  }, [title, description, keywords, image, url]);
};

export default useSEO;