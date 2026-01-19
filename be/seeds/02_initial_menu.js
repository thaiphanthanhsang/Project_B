const productMenuData = [
  {
    id: 1,
    name: "Badminton Rackets",
    path: "/product/rackets",
    subcategories: [
      { id: 101, name: "Yonex Rackets", path: "/product/rackets/yonex" },
      { id: 102, name: "Victor Rackets", path: "/product/rackets/victor" },
      { id: 103, name: "Lining Rackets", path: "/product/rackets/lining" },
    ],
  },
  {
    id: 2,
    name: "Badminton Shoes",
    path: "/product/shoes",
    subcategories: [
      { id: 201, name: "Yonex Shoes", path: "/product/shoes/yonex" },
      { id: 202, name: "Victor Shoes", path: "/product/shoes/victor" },
      { id: 203, name: "Lining Shoes", path: "/product/shoes/lining" },
    ],
  },
  {
    id: 3,
    name: "Badminton Shirts",
    path: "/product/shirts",
    subcategories: [
      { id: 301, name: "Yonex Shirts", path: "/product/shirts/yonex" },
      { id: 302, name: "Victor Shirts", path: "/product/shirts/victor" },
      { id: 303, name: "Lining Shirts", path: "/product/shirts/lining" },
    ],
  },
  {
    id: 4,
    name: "Racket Bags",
    path: "/product/bags",
    subcategories: [
      { id: 401, name: "Yonex Bags", path: "/product/bags/yonex" },
      { id: 402, name: "Victor Bags", path: "/product/bags/victor" },
      { id: 403, name: "Lining Bags", path: "/product/bags/lining" },
    ],
  },
  {
    id: 5,
    name: "Accessories",
    path: "/product/accessories",
    subcategories: [
      { id: 501, name: "Badminton Socks", path: "/product/accessories/socks" },
      { id: 502, name: "Racket Strings", path: "/product/accessories/strings" },
      {
        id: 503,
        name: "Shuttlecocks",
        path: "/product/accessories/shuttlecock",
      },
    ],
  },
];

export async function seed(knex) {
  // Clear existing data
  await knex("subcategories").del();
  await knex("categories").del();

  // Insert categories and subcategories
  await Promise.all(
    productMenuData.map(async (category) => {
      await knex("categories").insert({
        id: category.id,
        name: category.name,
        path: category.path,
      });

      const subcategoriesToInsert = category.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        path: sub.path,
        category_id: category.id,
      }));

      await knex("subcategories").insert(subcategoriesToInsert);
    })
  );
}
