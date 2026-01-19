import { memo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../utils/api.js";
import "./style.css";
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
    <div className="product-page-container">
      <h1 className="product-page-title">{getTitle()}</h1>

      {products.length > 0 ? (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <Link
                to={`/product/product-details/${product.id}`}
                key={product.id}
                className="product-card"
              >
                <div className="product-card-image-wrapper">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="product-card-body">
                  <h3 className="product-card-name">{product.name}</h3>
                  <p className="product-card-price">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="no-products-message">
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
};

export default memo(ProductPage);
