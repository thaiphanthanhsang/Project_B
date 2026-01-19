const allProducts = [
  // ========== 1. BADMINTON RACKETS ==========
  {
    id: "p1",
    name: "Yonex Astrox 100ZZ VA Badminton Racket",
    category: "rackets",
    brand: "yonex",
    price: 10000000,
    originalPrice: 12000000,
    status: "In stock",
    quantity: 10,
    imageUrl: "/racketImage/yonex_100zz.jpg",
    images: [
      "/racketImage/yonex_100zz.jpg",
      "/racketImage/yonex_100zz(1).jpg",
      "/racketImage/yonex_100zz(2).jpg",
      "/racketImage/yonex_100zz(3).jpg",
    ],
    sizes: ["3u5", "3u6", "4u5", "4u6"],
  },
  {
    id: "p2",
    name: "Yonex Nanoflare 800 Badminton Racket",
    category: "rackets",
    brand: "yonex",
    price: 4769000,
    originalPrice: 5722800,
    quantity: 10,
    imageUrl: "/racketImage/yonex_800pro.jpg",
    images: [
      "/racketImage/yonex_800pro(1).jpg",
      "/racketImage/yonex_800pro(2).jpg",
    ],
    sizes: ["3u5", "3u6", "4u5", "4u6"],
  },
  {
    id: "p3",
    name: "Victor Auraspeed 100X Ultra New 2025 Badminton Racket",
    category: "rackets",
    brand: "victor",
    price: 3800000,
    quantity: 10,
    imageUrl: "/racketImage/victor_racket.jpg",
    images: [
      "/racketImage/victor_racket.jpg",
      "/racketImage/victor_racket(1).jpg",
    ],
    sizes: ["3u5", "3u6", "4u5", "4u6"],
  },
  {
    id: "p4",
    name: "Victor Brave Sword 12 Pro Badminton Racket",
    category: "rackets",
    brand: "victor",
    price: 3950000,
    quantity: 10,
    imageUrl: "/racketImage/victor_racket(2).jpg",
    images: [
      "/racketImage/victor_racket(2).jpg",
      "/racketImage/victor_racket(3).jpg",
      "/racketImage/victor_racket(4).jpg",
    ],
    sizes: ["3u5", "3u6", "4u5", "4u6"],
  },
  {
    id: "p5",
    name: "Lining Axforce 90 Badminton Racket",
    category: "rackets",
    brand: "lining",
    price: 4100000,
    quantity: 10,
    imageUrl: "/racketImage/lining_racket.jpg",
    images: [
      "/racketImage/lining_racket.jpg",
      "/racketImage/lining_racket(1).jpg",
    ],
    sizes: ["3u5", "3u6", "4u5", "4u6"],
  },
  {
    id: "p6",
    name: "Lining Halbertec 9000 Limited Edition Set - Olympic Paris 2024",
    category: "rackets",
    brand: "lining",
    price: 10000000,
    quantity: 10,
    imageUrl: "/racketImage/lining_racket(2).jpg",
    images: [
      "/racketImage/lining_racket(2).jpg",
      "/racketImage/lining_racket(3).jpg",
      "/racketImage/lining_racket(4).jpg",
    ],
    sizes: ["3u5", "3u6", "4u5", "4u6"],
  },

  // ========== 2. BADMINTON SHOES ==========
  {
    id: "p7",
    name: "Yonex SHB 65Z3 Badminton Shoes",
    category: "shoes",
    brand: "yonex",
    price: 2800000,
    quantity: 10,
    imageUrl: "/shoesImage/yonex_65z3.jpg",
    images: [
      "/shoesImage/yonex_65z3.jpg",
      "/shoesImage/yonex_65z3(1).jpg",
      "/shoesImage/yonex_65z3(2).jpg",
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
  },
  {
    id: "p8",
    name: "Yonex Eclipsion Z Badminton Shoes",
    category: "shoes",
    brand: "yonex",
    price: 2950000,
    quantity: 10,
    imageUrl: "/shoesImage/yonex_eclipsion.jpg",
    images: ["/shoesImage/yonex_eclipsion(1).jpg"],
    sizes: [38, 39, 40, 41, 42, 43, 44],
  },

  // ========== 3. SHIRTS ==========
  {
    id: "p13",
    name: "Yonex TRM3089 Jet Black Official Shirt",
    category: "shirts",
    brand: "yonex",
    price: 119000,
    quantity: 50,
    imageUrl: "/shirtImage/yonex_shirt.jpg",
  },
  {
    id: "p14",
    name: "Yonex TRM3089 White Official Shirt",
    category: "shirts",
    brand: "yonex",
    price: 119000,
    quantity: 50,
    imageUrl: "/shirtImage/yonex_shirt(1).jpg",
  },

  // ========== 4. BAGS ==========
  {
    id: "p19",
    name: "Yonex BA02526VEX Racket Bag - Steel Gray Official",
    category: "bags",
    brand: "yonex",
    price: 1100000,
    quantity: 10,
    imageUrl: "/racketBag/yonex_racket_bag.jpg",
  },

  // ========== 5. ACCESSORIES ==========
  {
    id: "p25",
    name: "Yonex SKSL1086ZMP6 Official Socks",
    category: "accessories",
    brand: "socks",
    price: 120000,
    quantity: 50,
    imageUrl: "/accessory/socks.jpg",
  },
  {
    id: "p29",
    name: "Yonex AS50 Shuttlecock Tube",
    category: "accessories",
    brand: "shuttlecock",
    price: 1019000,
    quantity: 50,
    imageUrl: "/accessory/badminton_ball.jpg",
  },
];


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  const existing = await knex("products").first();

  if (existing) return;

  const productsToInsert = allProducts.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    brand: product.brand,
    price: product.price,
    originalPrice: product.originalPrice ?? null,
    quantity: product.quantity ?? 0,
    status: (product.quantity ?? 0) > 0 ? "In stock" : "Out of stock",
    imageUrl: product.imageUrl ?? null,
    images: JSON.stringify(product.images ?? []),
    sizes: JSON.stringify(product.sizes ?? []),
    colors: JSON.stringify(product.colors ?? []),
  }));

  await knex("products").insert(productsToInsert);
}

