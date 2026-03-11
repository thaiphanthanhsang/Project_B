import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FreeMode } from "swiper/modules";
import "swiper/css/free-mode";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import api from "../../../utils/api.js";

const categories = [
  { id: "all", name: "All" },
  { id: "rackets", name: "Rackets" },
  { id: "shoes", name: "Shoes" },
  { id: "shirts", name: "Shirts" },
  { id: "bags", name: "Bags" },
  { id: "accessories", name: "Accessories" },
];

const NewProductSection = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (activeTab !== "all") {
          params.append("category", activeTab);
        }
        params.append("limit", 15);

        const res = await api.get(`/products/public?${params.toString()}`);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error loading new products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
            New Products
          </h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Categories Swiper */}
        <div className="mb-8">
          <Swiper
            modules={[FreeMode]}
            slidesPerView="auto"
            spaceBetween={10}
            freeMode={true}
            observer={true}
            observeParents={true}
            className="w-full"
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id} style={{ width: "auto" }}>
                <button
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === cat.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">Loading...</div>
          ) : (
            products.map((product) => {
              let parsedImages = [];
              try {
                parsedImages =
                  typeof product.images === "string"
                    ? JSON.parse(product.images)
                    : product.images || [];
              } catch {
                parsedImages = [];
              }
              return (
                <div
                  key={product.id}
                  className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <Link
                    to={`/${ROUTERS.USER.PRODUCTS}/product-details/${product.id}`}
                    className="block h-full"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={product.imageUrl || product.image} // Handle both fields
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {parsedImages.length > 0 && (
                        <img
                          src={
                            parsedImages[0] !==
                            (product.imageUrl || product.image)
                              ? parsedImages[0]
                              : parsedImages[1] || parsedImages[0]
                          }
                          alt={`${product.name} hover`}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          onError={({ currentTarget }) => {
                            currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-black px-2 py-1 rounded-md shadow-lg border border-red-400">
                            -
                            {Math.round(
                              (1 - product.price / product.originalPrice) * 100,
                            )}
                            %
                          </div>
                        )}
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-2 h-10 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex flex-col">
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">
                              {product.originalPrice?.toLocaleString()} đ
                            </span>
                          )}
                        <div className="text-blue-600 font-bold text-lg">
                          {product.price?.toLocaleString()} đ
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })
          )}

          {!loading && products.length === 0 && (
            <p className="col-span-full text-center text-gray-500 italic py-8">
              No products found in this category.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewProductSection;
