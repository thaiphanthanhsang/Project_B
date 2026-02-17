import { useState, useEffect } from "react";
import api from "../../utils/api.js";
import ProductFormModal from "./ProductFormModal.jsx";
import ConfirmationModal from "../../components/common/ConfirmationModal.jsx";

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", err);
    }
    setLoading(false);
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete}`);
      setProducts(products.filter((p) => p.id !== productToDelete));
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại!");
    } finally {
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCreate = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = (savedProduct) => {
    if (currentProduct === null) {
      setProducts([...products, savedProduct]);
    } else {
      setProducts(
        products.map((p) => (p.id === savedProduct.id ? savedProduct : p)),
      );
    }
  };

  if (loading) return <p>Đang tải danh sách sản phẩm...</p>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Quản lý Sản phẩm</h2>
        <div className="admin-header-actions">
          <button className="btn-primary" onClick={handleCreate}>
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Loại</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price.toLocaleString("vi-VN")}₫</td>
              <td>
                <button
                  onClick={() => handleEdit(product)}
                  className="btn-edit"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteClick(product.id)}
                  className="btn-delete"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={currentProduct}
        onSave={handleSave}
      />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default ProductManagementPage;
