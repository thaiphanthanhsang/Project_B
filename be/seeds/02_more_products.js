const moreProducts = [
    // ========== RACKETS ==========
    {
        id: "p_add_1",
        name: "Lining Tectonic 7 Badminton Racket",
        category: "rackets",
        brand: "lining",
        price: 3200000,
        originalPrice: 4000000,
        quantity: 15,
        imageUrl: "/racketImage/lining_racket(1).jpg",
        images: ["/racketImage/lining_racket(1).jpg", "/racketImage/lining_racket(2).jpg"],
        sizes: ["3u5", "4u5"],
    },
    {
        id: "p_add_2",
        name: "Lining Axforce 80 Badminton Racket",
        category: "rackets",
        brand: "lining",
        price: 3500000,
        quantity: 12,
        imageUrl: "/racketImage/lining_racket(3).jpg",
        images: ["/racketImage/lining_racket(3).jpg", "/racketImage/lining_racket(4).jpg"],
        sizes: ["3u5", "4u5", "5u5"],
    },
    {
        id: "p_add_3",
        name: "Victor Thruster K Falcon",
        category: "rackets",
        brand: "victor",
        price: 3100000,
        quantity: 8,
        imageUrl: "/racketImage/victor_racket(1).jpg",
        images: ["/racketImage/victor_racket(1).jpg"],
        sizes: ["4u5", "5u5"],
    },
    {
        id: "p_add_4",
        name: "Victor DriveX 9X",
        category: "rackets",
        brand: "victor",
        price: 3300000,
        quantity: 10,
        imageUrl: "/racketImage/victor_racket(3).jpg",
        images: ["/racketImage/victor_racket(3).jpg", "/racketImage/victor_racket(4).jpg"],
        sizes: ["3u5", "4u5"],
    },

    // ========== SHOES ==========
    {
        id: "p_add_5",
        name: "Lining Ranger 5 Professional Shoes",
        category: "shoes",
        brand: "lining",
        price: 1800000,
        quantity: 20,
        imageUrl: "/shoesImage/lining_shoes(1).jpg",
        images: ["/shoesImage/lining_shoes(1).jpg", "/shoesImage/lining_shoes(2).jpg"],
        sizes: [39, 40, 41, 42, 43],
    },
    {
        id: "p_add_6",
        name: "Lining Blade Pro Shoes",
        category: "shoes",
        brand: "lining",
        price: 2100000,
        quantity: 18,
        imageUrl: "/shoesImage/lining_shoes(3).jpg",
        images: ["/shoesImage/lining_shoes(3).jpg", "/shoesImage/lining_shoes(4).jpg"],
        sizes: [39, 40, 41, 42, 43, 44],
    },
    {
        id: "p_add_7",
        name: "Victor S82 Speed Shoes",
        category: "shoes",
        brand: "victor",
        price: 2300000,
        quantity: 15,
        imageUrl: "/shoesImage/victor_shoes(1).jpg",
        images: ["/shoesImage/victor_shoes(1).jpg", "/shoesImage/victor_shoes(2).jpg"],
        sizes: [39, 40, 41, 42, 43],
    },
    {
        id: "p_add_8",
        name: "Victor P9200 Support Shoes",
        category: "shoes",
        brand: "victor",
        price: 2500000,
        quantity: 10,
        imageUrl: "/shoesImage/victor_shoes(3).jpg",
        images: ["/shoesImage/victor_shoes(3).jpg", "/shoesImage/victor_shoes(4).jpg"],
        sizes: [40, 41, 42, 43],
    },
    {
        id: "p_add_9",
        name: "Yonex Power Cushion 65 Z3 White/Red",
        category: "shoes",
        brand: "yonex",
        price: 2800000,
        quantity: 25,
        imageUrl: "/shoesImage/yonex_shoes(1).jpg",
        images: ["/shoesImage/yonex_shoes(1).jpg", "/shoesImage/yonex_shoes.jpg"],
        sizes: [38, 39, 40, 41, 42, 43, 44],
    },

    // ========== SHIRTS ==========
    {
        id: "p_add_10",
        name: "Lining Competition Shirt Red",
        category: "shirts",
        brand: "lining",
        price: 550000,
        quantity: 50,
        imageUrl: "/shirtImage/lining_shirt.jpg",
        images: ["/shirtImage/lining_shirt.jpg"],
        sizes: ["S", "M", "L", "XL"],
    },
    {
        id: "p_add_11",
        name: "Victor Tournament Shirt Blue",
        category: "shirts",
        brand: "victor",
        price: 600000,
        quantity: 45,
        imageUrl: "/shirtImage/victor_shirt.jpg",
        images: ["/shirtImage/victor_shirt.jpg"],
        sizes: ["S", "M", "L", "XL"],
    },

    // ========== BAGS ==========
    {
        id: "p_add_12",
        name: "Lining Rectangular Kit Bag 9-Racket",
        category: "bags",
        brand: "lining",
        price: 1500000,
        quantity: 8,
        imageUrl: "/racketBag/lining_racket_bag(1).jpg",
        images: ["/racketBag/lining_racket_bag(1).jpg", "/racketBag/lining_racket_bag(2).jpg"],
    },
    {
        id: "p_add_13",
        name: "Victor Square Bag",
        category: "bags",
        brand: "victor",
        price: 1350000,
        quantity: 10,
        imageUrl: "/racketBag/victor_racket_bag(1).jpg",
        images: ["/racketBag/victor_racket_bag(1).jpg"],
    },
    {
        id: "p_add_14",
        name: "Yonex Tournament Bag Blue",
        category: "bags",
        brand: "yonex",
        price: 1800000,
        quantity: 12,
        imageUrl: "/racketBag/yonex_racket_bag(1).jpg",
        images: ["/racketBag/yonex_racket_bag(1).jpg"],
    }
];

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    // Check if these specific products already exist to avoid duplicate key errors
    // We'll check the first one as a heuristic
    const existing = await knex("products").where("id", "p_add_1").first();
    if (existing) return;

    const productsToInsert = moreProducts.map((product) => ({
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
