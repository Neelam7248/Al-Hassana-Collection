 const categoriesConfig = {
  fragrances: {
    slug: "fragrances",
    label: "Fragrances",
    subCategories: {
      "luxury-men": { label: "Luxury Perfumes - Men", slug: "luxury-men" },
      "luxury-women": { label: "Luxury Perfumes - Women", slug: "luxury-women" },
      "signature-men": { label: "Signature Perfumes - Men", slug: "signature-men" },
      "signature-women": { label: "Signature Perfumes - Women", slug: "signature-women" },
      "mini-tester": { label: "Mini Scent Tester", slug: "mini-tester" },
      "gift-edition": { label: "Gift Edition", slug: "gift-edition" },
      "attar-arabic": { label: "Arabic Attar", slug: "attar-arabic" },
      "attar-non-arabic": { label: "Non Arabic Attar", slug: "attar-non-arabic" },
      bakhoor: { label: "Bakhoor", slug: "bakhoor" },
      burner: { label: "Electric Burner", slug: "electric-burner" },
    },
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
    },
  },

  clothing: {
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