import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./style.css";

const categories = [
  { id: "0", name: "All" },
  { id: "7", name: "Badminton Rackets" },
  { id: "4", name: "Badminton Shoes" },
  { id: "6", name: "Badminton Shirts" },
  { id: "156", name: "Badminton Skirts" },
  { id: "3", name: "Badminton Shorts" },
  { id: "1", name: "Badminton Bags" },
  { id: "2", name: "Badminton Backpacks" },
  { id: "11", name: "Badminton Accessories" },
  { id: "256", name: "Pickleball Rackets" },
  { id: "318", name: "Pickleball Shoes" },
  { id: "325", name: "Pickleball Bags" },
  { id: "322", name: "Pickleball Shirts" },
  { id: "323", name: "Pickleball Shorts" },
  { id: "306", name: "Pickleball Balls" },
  { id: "210", name: "Tennis Rackets" },
  { id: "211", name: "Tennis Shoes" },
  { id: "212", name: "Tennis Backpacks" },
  { id: "213", name: "Tennis Bags" },
  { id: "214", name: "Tennis Skirts" },
  { id: "248", name: "Tennis Shirts" },
  { id: "249", name: "Tennis Shorts" },
  { id: "238", name: "Tennis Accessories" },
  { id: "154", name: "Running Shoes" },
  { id: "202", name: "Hats" },
  { id: "273", name: "Collectible Accessories" },
  { id: "305", name: "Pickleball Accessories" },
  { id: "324", name: "Pickleball Backpacks" },
  { id: "425", name: "Taro Pickleball Rackets" },
];

// Sản phẩm mẫu
const allProducts = [
  {
    id: 1,
    name: "Yonex Astrox 99 Racket",
    price: 2500000,
    catId: "7",
    image: "/newProduct/99pro.jpg",
  },
  {
    id: 2,
    name: "Yonex 65Z3 Shoes",
    price: 1800000,
    catId: "4",
    image: "/newProduct/65z3.jpg",
  },
  {
    id: 3,
    name: "Lining Badminton Shirt",
    price: 350000,
    catId: "6",
    image: "/newProduct/lining.jpg",
  },
  {
    id: 4,
    name: "Women’s Badminton Skirt",
    price: 420000,
    catId: "156",
    image: "/newProduct/skirtTaro.jpg",
  },
  {
    id: 5,
    name: "Yonex Badminton Shorts",
    price: 320000,
    catId: "3",
    image: "/newProduct/shortYonex.jpg",
  },
  {
    id: 6,
    name: "Yonex Bag",
    price: 1500000,
    catId: "1",
    image: "/newProduct/bagYonex.jpg",
  },
  {
    id: 7,
    name: "Adidas Badminton Backpack",
    price: 890000,
    catId: "2",
    image: "/newProduct/bagAddidas.jpg",
  },
  {
    id: 8,
    name: "Racket Grip Accessories",
    price: 50000,
    catId: "11",
    image: "/newProduct/items.jpg",
  },
  {
    id: 9,
    name: "Taro Pickleball Racket",
    price: 2200000,
    catId: "256",
    image: "/newProduct/racketPickleball.jpg",
  },
  {
    id: 10,
    name: "Wilson Pro Staff Tennis Racket",
    price: 4500000,
    catId: "210",
    image: "/newProduct/racketTennis.jpg",
  },
];

const NewProductSection = () => {
  const [activeTab, setActiveTab] = useState("0");

  const filteredProducts =
    activeTab === "0"
      ? allProducts
      : allProducts.filter((p) => p.catId === activeTab);

  return (
    <section className="section_flash_sale">
      <div className="container">
        <div className="title_modules">
          <h2>
            <a href="/product" title="#Sản phẩm mới">
              <span>New Products</span>
            </a>
          </h2>
        </div>

        {/* Tabs bằng Swiper */}
        <Swiper
          slidesPerView="auto"
          spaceBetween={10}
          freeMode={true}
          className="tabs-swiper"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.id} style={{ width: "auto" }}>
              <div
                className={`tab-link ${activeTab === cat.id ? "current" : ""}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.name}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Nội dung sản phẩm */}
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h4>{product.name}</h4>
              <p className="price">{product.price.toLocaleString()} đ</p>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <p className="no-products">Không có sản phẩm nào.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewProductSection;
