const categoriesConfig = {
  fragrances: {
    slug: "fragrances",
    label: "Fragrances",
    subCategories: {
      "fresh-cool": { label: "Fresh & Cool", slug: "fresh-cool" }, 
      floral: { label: "Floral", slug: "floral" }, 
      "sweet-gourmand": { label: "Sweet / Chocolate", slug: "sweet-gourmand" }, 
      "woody-oriental": { label: "Woody / Oriental", slug: "woody-oriental" }, 
      "oud-premium": { label: "Oud / Premium", slug: "oud-premium" }, 
      attar: { label: "Attar (Oil Perfumes)", slug: "attar" }, 
      bakhoor: { label: "Bakhoor", slug: "bakhoor" },
      burner: { label: "Electric Burner", slug: "electric-burner" },
      "gift-set": { label: "Gift Sets", slug: "gift-set" },
      "mini-tester": { label: "Mini Scent Tester", slug: "mini-tester" }
    },
  },

  oils: {
    slug: "oils",
    label: "Hair & Body Oils",
    subCategories: {
      "rosemary-amla": { label: "Rosemary with Amla Oil", slug: "rosemary-amla" },
      "amla-oil": { label: "Amla Oil", slug: "amla-oil" },
      "coconut-amla": { label: "Coconut with Amla Oil", slug: "coconut-amla" },
      "argan-oil": { label: "Argan Oil", slug: "argan-oil" },
      "jojoba-oil": { label: "Jojoba Oil", slug: "jojoba-oil" },
      "mixed-oils": { label: "Mixed Herbal Oils", slug: "mixed-oils" }
    }
  },

  hajjUmrah: {
    slug: "hajj-umrah",
    label: "Hajj & Umrah",
    subCategories: {
      "ehram-men": { label: "Ehram - Men", slug: "ehram-men" },
      "ehram-women": { label: "Ehram - Women", slug: "ehram-women" },
      tasbeeh: { label: "Tasbeeh", slug: "tasbeeh" },
      janamaz: { label: "Janamaz", slug: "janamaz" },
      "ihram-belt": { label: "Ihram Belt", slug: "ihram-belt" },
      zamzam: { label: "Zam Zam Bottle", slug: "zamzam-bottle" },
          caps: { label: "Caps", slug: "caps" },
    },
  },

  /*clothing: {
    slug: "clothing",
    label: "Clothing",
    subCategories: {
      jackets: { label: "Jackets", slug: "jackets" },
      shirts: { label: "Shirts", slug: "shirts" },
      tshirts: { label: "T-Shirts", slug: "t-shirts" },
      jeans: { label: "Jeans", slug: "jeans" },
      pants: { label: "Pants", slug: "pants" },
      hoodies: { label: "Hoodies", slug: "hoodies" },
      suits: { label: "Suits", slug: "suits" },
      caps: { label: "Caps", slug: "caps" },
    },
  },
*/
  accessories: {
    slug: "accessories",
    label: "Accessories",
    subCategories: {
      wallet: { label: "Wallets", slug: "wallet" },
      watch: { label: "Watches", slug: "watches" },
      belt: { label: "Belts", slug: "belts" },
      perfumeBox: { label: "Perfume Boxes", slug: "perfume-boxes" },
    },
  },

  tasbeeh: {
    slug: "tasbeeh",
    label: "Tasbeeha / Counters",
    subCategories: {
      "tasbeeh-misbah": { label: "Misbah / Prayer Beads", slug: "tasbeeh-misbah" },
      "counter-digital": { label: "Digital Counters", slug: "counter-digital" },
      "counter-mechanical": { label: "Mechanical Counters", slug: "counter-mechanical" },
      "rosary-box": { label: "Rosary Box", slug: "rosary-box" },
    },
  },

};

module.exports = { categoriesConfig };
