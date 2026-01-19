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
    imageUrl: "",
    status: "In stock",
    images: "",
    sizes: "",
    colors: "[]",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSubmit = {
      ...formData,
      price: parseInt(formData.price, 10),
      originalPrice: parseInt(formData.originalPrice, 10) || null,
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
      console.error("Lỗi khi lưu sản phẩm:", err);
      alert("Lưu thất bại!");
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
        <h3>{isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="name">Tên sản phẩm</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Loại (Category)</label>
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
              <label htmlFor="brand">Thương hiệu (Brand)</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Giá bán</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="originalPrice">Giá gốc (Tùy chọn)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Ảnh đại diện (URL)</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Còn hàng">Còn hàng</option>
                <option value="Hết hàng">Hết hàng</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label htmlFor="images">
                Danh sách ảnh (Phân cách bằng dấu phẩy)
              </label>
              <textarea
                name="images"
                value={formData.images}
                onChange={handleChange}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="sizes">Sizes (Phân cách bằng dấu phẩy)</label>
              <textarea
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="colors">Biến thể màu (Nhập dạng JSON)</label>
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
              Hủy
            </button>
            {/* 2. XÓA 'disabled' KHỎI NÚT SUBMIT */}
            <button type="submit" className="btn-primary">
              {isSubmitting
                ? "Đang lưu..."
                : isEditing
                  ? "Lưu thay đổi"
                  : "Thêm sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
