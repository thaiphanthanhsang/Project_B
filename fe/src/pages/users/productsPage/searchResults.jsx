import { memo, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
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

const SearchResults = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query") || "";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.append("q", query);
                params.append("page", currentPage);

                const res = await api.get(`/products/search?${params.toString()}`);

                const data = res.data;

                setProducts(data.products || []);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                console.error("Error fetching search results:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, currentPage]);


    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    if (loading) {
        return (
            <div className="product-page-container">
                <h1 className="product-page-title">Loading search results...</h1>
            </div>
        );
    }

    return (
        <div className="product-page-container">
            <h1 className="product-page-title">
                Search results for: <span style={{ color: "#ff6600" }}>{query}</span>
            </h1>

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

export default memo(SearchResults);
