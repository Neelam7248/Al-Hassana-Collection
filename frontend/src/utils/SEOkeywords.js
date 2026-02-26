// src/utils/seoKeywords.js
export const generateKeywordsForCategory = (categoriesConfig) => {
  const keywordsMap = {};

  for (const catKey in categoriesConfig) {
    const cat = categoriesConfig[catKey];
    const baseKeywords = [cat.label, cat.slug];

    for (const subKey in cat.subCategories) {
      const subCat = cat.subCategories[subKey];
      // Combine category + subcategory
      const combinedKeywords = [...baseKeywords, subCat.label, subCat.slug];

      // Save for this subcategory
      keywordsMap[subCat.slug] = combinedKeywords.join(", ");
    }
  }

  return keywordsMap;
};