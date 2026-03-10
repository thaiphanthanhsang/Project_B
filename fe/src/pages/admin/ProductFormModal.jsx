import { useState, useEffect } from "react";
import api from "../../utils/api.js";

const ProductFormModal = ({ isOpen, onClose, product, onSave }) => {
  const isEditing = product !== null;

  const [formData, setFormData] = useState({
    name: "",
    category: "rackets",
    brand: "yonex",
    price: 0,
    originalPrice: 0,
    quantity: 0,
    imageUrl: "",
    status: "In stock",
    images: "",
    sizes: "",
    colors: "[]",
  });

  const [discountPercentage, setDiscountPercentage] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-calculate discount percentage when originalPrice or price changes externally (e.g., when editing a product)
  useEffect(() => {
    const orig = parseInt(formData.originalPrice, 10);
    const curr = parseInt(formData.price, 10);

    if (orig && curr && orig > 0 && curr <= orig) {
      const percentage = Math.round((1 - curr / orig) * 100);
      setDiscountPercentage(percentage);
    } else {
      setDiscountPercentage(0);
    }
  }, [formData.originalPrice, formData.price, product]); // Only run when originalPrice or the selected product changes

  useEffect(() => {
    if (isEditing) {
      setFormData({
        ...product,
        images: Array.isArray(product.images) ? product.images.join(", ") : "",
        sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
        colors: JSON.stringify(product.colors || []),
      });
    } else {
      setFormData({
        name: "",
        category: "rackets",
        brand: "yonex",
        price: 0,
        originalPrice: 0,
        quantity: 0,
        imageUrl: "",
        status: "In stock",
        images: "",
        sizes: "",
        colors: "[]",
      });
    }
  }, [product, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // If price is manually changed, re-calculate the discount percentage
      if (name === "price") {
        const orig = parseInt(updated.originalPrice, 10);
        const curr = parseInt(value, 10);
        if (orig && curr && orig > 0 && curr <= orig) {
          setDiscountPercentage(Math.round((1 - curr / orig) * 100));
        } else {
          setDiscountPercentage(0);
        }
      }

      // If originalPrice is manually changed, re-calculate the final price based on current discountPercentage
      if (name === "originalPrice") {
        const newOrig = parseInt(value, 10);
        if (newOrig && newOrig > 0) {
          updated.price = Math.round(newOrig * (1 - discountPercentage / 100));
        }
      }

      return updated;
    });
  };

  const handleDiscountChange = (e) => {
    const newDiscount = parseInt(e.target.value, 10) || 0;
    setDiscountPercentage(newDiscount);

    // Auto-calculate final price based on the new discount percentage
    setFormData((prev) => {
      const orig = parseInt(prev.originalPrice, 10);
      if (orig && orig > 0) {
        return { ...prev, price: Math.round(orig * (1 - newDiscount / 100)) };
      }
      return prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSubmit = {
      ...formData,
      price: parseInt(formData.price, 10),
      originalPrice: parseInt(formData.originalPrice, 10) || null,
      quantity: parseInt(formData.quantity, 10) || 0,
      images: formData.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      sizes: formData.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: JSON.parse(formData.colors || "[]"),
    };

    try {
      let response;
      if (isEditing) {
        response = await api.put(`/products/${product.id}`, dataToSubmit);
      } else {
        response = await api.post("/products", dataToSubmit);
      }
      onSave(response.data);
      onClose();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Save failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <h3>{isEditing ? "Edit Product" : "Add New Product"}</h3>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="rackets">rackets</option>
                <option value="shoes">shoes</option>
                <option value="shirts">shirts</option>
                <option value="bags">bags</option>
                <option value="accessories">accessories</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Sale Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="originalPrice">Original Price (Optional)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="discountPercentage">Discount Amount (%)</label>
              <input
                type="number"
                name="discountPercentage"
                min="0"
                max="100"
                value={discountPercentage}
                onChange={handleDiscountChange}
                placeholder="Example: 10"
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Stock Quantity</label>
              <input
                type="number"
                name="quantity"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Example: 50"
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Main Image (URL)</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="In stock">In stock</option>
                <option value="Out of stock">Out of stock</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label htmlFor="images">Image List (Comma separated)</label>
              <textarea
                name="images"
                value={formData.images}
                onChange={handleChange}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="sizes">Sizes (Comma separated)</label>
              <textarea
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="colors">Color Variants (JSON Input)</label>
              <textarea
                name="colors"
                value={formData.colors}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            {/* 1. XÓA 'disabled' KHỎI NÚT HỦY */}
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            {/* 2. XÓA 'disabled' KHỎI NÚT SUBMIT */}
            <button type="submit" className="btn-primary">
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
