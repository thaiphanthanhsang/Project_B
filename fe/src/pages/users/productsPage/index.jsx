import { memo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../utils/api.js";

import Pagination from "../../../component/Pagination.jsx";

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
};

const ProductPage = () => {
  const { category, brand } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (brand) params.append("brand", brand);
        params.append("page", currentPage);
        params.append("limit", 10);

        const res = await api.get(`/products/public?${params.toString()}`);

        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, brand, currentPage]);

  const getTitle = () => {
    if (brand && category) return `${brand} / ${category}`;
    if (category) return category;
    return "All Products";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="product-page-container">
        <h1 className="product-page-title">Loading products...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">
          {getTitle()}
        </h1>
        <div className="w-16 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></div>
      </div>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => {
              let parsedImages = [];
              try {
                parsedImages =
                  typeof product.images === "string"
                    ? JSON.parse(product.images)
                    : product.images || [];
              } catch {
                // Ignore parse errors, fallback to empty array
              }
              return (
                <div
                  key={product.id}
                  className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <Link
                    to={`/product/product-details/${product.id}`}
                    className="block h-full"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {parsedImages.length > 0 && (
                        <img
                          src={
                            parsedImages[0] !== product.imageUrl
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
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex flex-col">
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        <p className="text-blue-600 font-bold text-lg">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-500 italic">
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
};

export default memo(ProductPage);
