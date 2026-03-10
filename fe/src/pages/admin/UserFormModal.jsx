import { useState, useEffect } from "react";
import api from "../../utils/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const UserFormModal = ({ isOpen, onClose, user, onSave }) => {
  const { user: loggedInUser } = useAuth();
  const isEditing = user !== null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "user",
        password: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "user",
        password: "",
      });
    }
  }, [user, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let dataToSubmit = { ...formData };

    if (isEditing && !formData.password) {
      delete dataToSubmit.password;
    } else if (!isEditing && !formData.password) {
      alert("Password is required when adding a new user.");
      setIsSubmitting(false);
      return;
    }

    try {
      let response;
      if (isEditing) {
        response = await api.put(`/users/${user.id}`, dataToSubmit);
      } else {
        response = await api.post("/users", dataToSubmit);
      }
      onSave(response.data);
      onClose();
    } catch (err) {
      console.error("Error saving user:", err);
      alert(err.response?.data?.message || "Save failed!");
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
        <h3>{isEditing ? "Edit User" : "Add New User"}</h3>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Name (*)</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email (*)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password {isEditing ? "(Leave blank if no change)" : "(*)"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role (*)</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="user">user</option>
                <option value="admin">admin</option>
                {loggedInUser?.role === "superadmin" && (
                  <option value="superadmin">superadmin</option>
                )}
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
