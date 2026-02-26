const categoriesConfig = {
  fragrances: {
    label: "Fragrances",
    slug: "fragrances",
    keywords: ["fragrances", "Coolwater", 
"Ice cool",
"Aqua Giorgio armani",

"Fresh elizbeth arden",
"Polo sports fresh ( Ralph lauren)",
"Al-Hassana collections", "perfume online"],
    subCategories: {
      freshCool: {
        label: "Fresh & Cool",
        slug: "fresh-cool",
        keywords: [
          "fresh & cool fragrances",
          "fresh perfume",
          "cool perfume","Coolwater", 
"Ice cool",
"Aqua Giorgio armani",

"Fresh elizbeth arden",
"Polo sports fresh ( Ralph lauren)",
          "Al-Hassana fragrances"
        ]
      },
      floral: {
        label: "Floral",
        slug: "floral",
        keywords: [
          "floral fragrance",
          "flower perfume","Gucci flora",
"Still Jasmin",
"Fresh rose",
"Motia ",
"Givenchi",
"Daisy love",
          "Al-Hassana collections"
        ]
      },
      attar: {
        label: "Attar (Oil Perfumes)",
        slug: "attar-oil-perfumes",
        keywords: ["attar oil perfume", "natural attar", "Al-Hassana attar"]
      },
      bakhoor: {
        label: "Bakhoor",
        slug: "bakhoor",
        keywords: ["bakhoor incense", "home fragrance", "Al-Hassana bakhoor"]
      }
    }
  },

  oils: {
    label: "Hair & Body Oils",
    slug: "oils",
    keywords: ["hair oils", "body oils", "Al-Hassana oils"],
    subCategories: {
      rosemaryAmla: {
        label: "Rosemary with Amla Oil",
        slug: "rosemary-amla",
        keywords: ["rosemary amla oil", "herbal hair oil", "Al-Hassana oils"]
      },
      amlaOil: {
        label: "Amla Oil",
        slug: "amla-oil",
        keywords: ["amla hair oil", "natural hair oil", "Al-Hassana oils"]
      },
      mixedOils: {
        label: "Mixed Herbal Oils",
        slug: "mixed-oils",
        keywords: ["mixed herbal oil", "hair & body oil", "Al-Hassana oils"]
      }
    }
  },

  hajjUmrah: {
    label: "Hajj & Umrah",
    slug: "hajj-umrah",
    keywords: ["hajj supplies", "umrah products", "Al-Hassana Hajj"],
    subCategories: {
      ehramMen: {
        label: "Ehram - Men",
        slug: "ehram-men",
        keywords: ["men ihram", "hajj clothing men", "Al-Hassana ihram"]
      },
      ehramWomen: {
        label: "Ehram - Women",
        slug: "ehram-women",
        keywords: ["women ihram", "hajj clothing women", "Al-Hassana ihram"]
      },
      tasbeeh: {
        label: "Tasbeeh",
        slug: "tasbeeh",
        keywords: ["tasbeeh prayer beads", "rosary", "Al-Hassana tasbeeh"]
      },
      jaenamaz: {
        label: "Jaenamaz",
        slug: "jaenamaz",
        keywords: ["jaenamaz", "prayer mat", "Al-Hassana jaenamaz"]
      },
      ihramBelt: {
        label: "Ihram Belt",
        slug: "ihram-belt",
        keywords: ["ihram belt", "hajj belt", "Al-Hassana ihram"]
      },
      zamzamBottle: {
        label: "Zam Zam Bottle",
        slug: "zamzam-bottle",
        keywords: ["zamzam water bottle", "hajj accessories", "Al-Hassana zamzam"]
      },
      caps: {
        label: "Caps",
        slug: "caps",
        keywords: ["hajj cap", "umrah cap", "Al-Hassana caps"]
      }
    }
  },

  accessories: {
    label: "Accessories",
    slug: "accessories",
    keywords: ["accessories", "Al-Hassana accessories", "fashion accessories"],
    subCategories: {
      wallet: {
        label: "Wallets",
        slug: "wallet",
        keywords: ["wallet", "men wallet", "Al-Hassana wallet"]
      },
      watch: {
        label: "Watches",
        slug: "watches",
        keywords: ["watch", "wrist watch", "Al-Hassana watch"]
      },
      belt: {
        label: "Belts",
        slug: "belts",
        keywords: ["belt", "leather belt", "Al-Hassana belt"]
      },
      perfumeBox: {
        label: "Perfume Boxes",
        slug: "perfume-boxes",
        keywords: ["perfume box", "gift box", "Al-Hassana perfume box"]
      }
    }
  }
};

module.exports = { categoriesConfig };