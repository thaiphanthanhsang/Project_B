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
      console.error("Error fetching product list:", err);
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
      alert("Delete failed!");
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

  if (loading) return <p>Loading product list...</p>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Product Management</h2>
        <div className="admin-header-actions">
          <button className="btn-primary" onClick={handleCreate}>
            + Add Product
          </button>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Original Price</th>
            <th>Discount</th>
            <th>Quantity (Stock)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price.toLocaleString("en-US")}₫</td>
              <td>
                {product.originalPrice
                  ? `${product.originalPrice.toLocaleString("en-US")}₫`
                  : "-"}
              </td>
              <td>
                {product.originalPrice && product.originalPrice > product.price
                  ? `${Math.round((1 - product.price / product.originalPrice) * 100)}%`
                  : "-"}
              </td>
              <td>
                <span
                  style={{
                    color: product.quantity > 0 ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {product.quantity > 0 ? product.quantity : "Out of stock"}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleEdit(product)}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(product.id)}
                  className="btn-delete"
                >
                  Delete
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
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ProductManagementPage;
