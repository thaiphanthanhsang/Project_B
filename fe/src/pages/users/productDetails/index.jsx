import React, { useState, useEffect, memo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../../utils/api.js";
import { useCart } from "../../../context/CartContext.jsx";
import "./styles.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      const defaultColor = product.colors?.[0] || null;
      setSelectedColor(defaultColor);
      setMainImage(defaultColor?.img || product.imageUrl);
      setQuantity(1);
    }
  }, [product]);

  const maxQuantity = product?.quantity || 0;
  const isOutOfStock = maxQuantity <= 0;

  const handleAddToCart = () => {
    setError(null);
    setCartMessage(null);

    if (isOutOfStock) {
      setError("This product is out of stock!");
      return;
    }

    if (product.colors?.length > 0 && !selectedColor) {
      setError("Please select a color before adding to cart!");
      return;
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      setError("Please select a size before adding to cart!");
      return;
    }

    if (quantity > maxQuantity) {
      setError(`Only ${maxQuantity} item(s) left in stock`);
      return;
    }

    const colorName = selectedColor?.name || "Default";
    const sizeName = selectedSize || "Free size";
    const colorPrice = selectedColor?.price || product.price;

    const imageSrc =
      mainImage ||
      selectedColor?.images?.[0] ||
      selectedColor?.img ||
      product.imageUrl;

    const variantKey = `${product.id}-${colorName}-${sizeName}`;

    const productToAdd = {
      id: product.id,
      name: product.name,
      price: colorPrice,
      image: imageSrc,
      quantity,
      color: colorName,
      size: sizeName,
      variantKey,
    };

    addToCart(productToAdd);

    setCartMessage("Product added to cart!");
    setTimeout(() => setCartMessage(null), 3000);
  };

  const navigate = useNavigate();

  const handleBuyNow = () => {
    setError(null);

    if (isOutOfStock) return;

    if (product.colors?.length > 0 && !selectedColor) {
      setError("Please select a color!");
      return;
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      setError("Please select a size!");
      return;
    }

    const orderItem = {
      productId: product.id,
      name: product.name,
      price: selectedColor?.price || product.price,
      image: mainImage,
      quantity,
      color: selectedColor?.name || "Default",
      size: selectedSize || "Free size",
    };

    navigate("/checkout", {
      state: {
        cartItems: [orderItem],
        from: "buy-now",
      },
    });
  };

  if (loading) {
    return (
      <div className="container py-4">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found!</h2>
        <Link to="/product" className="back-link">
          Back to store
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        {/* LEFT */}
        <div className="col-md-5 text-center position-relative">
          <img
            src={mainImage}
            alt={product.name}
            className="img-fluid big-img mb-3"
          />
          {product.originalPrice && product.originalPrice > product.price && (
            <div
              className="position-absolute bg-danger text-white fw-bold px-2 py-1 rounded shadow"
              style={{
                top: "10px",
                right: "20px",
                fontSize: "0.9rem",
                zIndex: 10,
              }}
            >
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </div>
          )}

          {product.images && product.images.length > 0 && (
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              {(selectedColor?.images || product.images).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Image ${index + 1}`}
                  className={`thumb-img ${mainImage === img ? "active" : ""}`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="col-md-7">
          <h4 className="fw-bold">{product.name}</h4>

          <p>
            Code:{" "}
            <span className="text-danger fw-semibold">{product.id || "—"}</span>
            <br />
            Brand: <span className="fw-semibold">{product.brand}</span> |{" "}
            <span
              className={`fw-semibold ${
                isOutOfStock ? "text-danger" : "text-success"
              }`}
            >
              {isOutOfStock ? "Out of stock" : `In stock (${product.quantity})`}
            </span>
          </p>

          <p className="price mb-1">
            {product.price.toLocaleString()} ₫{" "}
            {product.originalPrice && (
              <span className="text-muted text-decoration-line-through ms-2">
                Original Price: {product.originalPrice.toLocaleString()} ₫
              </span>
            )}
          </p>

          {/* COLORS */}
          {product.colors && product.colors.length > 0 && (
            <div className="color-section mb-3">
              <h6 className="fw-semibold mb-2">Select [Color]:</h6>
              <div className="d-flex flex-wrap gap-2">
                {product.colors.map((color, i) => (
                  <div
                    key={i}
                    className={`color-box ${
                      selectedColor?.name === color.name ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelectedColor(color);
                      setMainImage(color.img || product.imageUrl);
                    }}
                  >
                    <img src={color.img} alt={color.name} />
                    <div className="color-info">
                      <span>{color.name}</span>
                      <br />
                      <strong>{color.price.toLocaleString()} ₫</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SIZES */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="size-section mb-3">
              <h6 className="fw-semibold mb-2">Select [Size]:</h6>
              <div className="d-flex flex-wrap gap-2">
                {product.sizes.map((size, i) => (
                  <button
                    key={i}
                    className={`btn btn-outline-secondary size-btn ${
                      selectedSize === size ? "active" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PROMOTIONS */}
          <div className="promo-box p-3 mb-3">
            <h6 className="text-danger fw-bold mb-2">🎁 PROMOTIONS</h6>
            <ul className="mb-0">
              <li>
                Buy a racket and get a free grip; buy shoes and get free socks
              </li>
              <li>100% genuine products guaranteed</li>
              <li>Pay after inspection and receiving the item</li>
            </ul>
          </div>

          {/* QUANTITY */}
          {!isOutOfStock && (
            <div className="quantity-section mb-3">
              <h6 className="fw-semibold mb-2">Quantity:</h6>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>

                <span className="fw-bold">{quantity}</span>

                <button
                  className="btn btn-outline-secondary"
                  disabled={quantity >= maxQuantity}
                  onClick={() =>
                    setQuantity((q) => Math.min(maxQuantity, q + 1))
                  }
                >
                  +
                </button>
              </div>
            </div>
          )}

          {error && <div className="cart-error-message">{error}</div>}
          {cartMessage && (
            <div className="cart-success-message">{cartMessage}</div>
          )}

          <div className="action-buttons d-flex flex-wrap gap-2 mt-3">
            <button
              className="btn btn-danger btn-lg"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              🛒 ADD TO CART
            </button>

            <button
              className="btn btn-warning btn-lg text-white"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              ⚡ BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetails);
