import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "./CategoriesPage.css";

function CategoriesPage() {
  const { isAuthenticated, isAdmin, loading, token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editName, setEditName] = useState("");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const fetchCategories = async () => {
    try {
      setError("");
      const res = await axios.get("http://127.0.0.1:8000/api/categories", {
        headers,
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Errore caricamento categorie:", err);
      setError("Unable to load categories.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin && token) {
      fetchCategories();
    } else {
      setPageLoading(false);
    }
  }, [isAuthenticated, isAdmin, token]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      await axios.post(
        "http://127.0.0.1:8000/api/categories",
        { name: name.trim() },
        { headers }
      );

      setName("");
      setMessage("Category created successfully.");
      fetchCategories();
    } catch (err) {
      console.error("Errore creazione categoria:", err);
      setError("Unable to create category.");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setEditName(category.name);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
    setEditName("");
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!editName.trim() || !selectedCategory) {
      setError("Category name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      await axios.put(
        `http://127.0.0.1:8000/api/categories/${selectedCategory.id}`,
        { name: editName.trim() },
        { headers }
      );

      setMessage("Category updated successfully.");
      closeEditModal();
      fetchCategories();
    } catch (err) {
      console.error("Errore aggiornamento categoria:", err);
      setError("Unable to update category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setMessage("");

      await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`, {
        headers,
      });

      setMessage("Category deleted successfully.");
      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch (err) {
      console.error("Errore eliminazione categoria:", err);
      setError("Unable to delete category.");
    }
  };

  if (loading) {
    return (
      <div className="admin-categories-page">
        <div className="admin-categories-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-categories-page">
      <div className="admin-categories-container">
        <div className="admin-categories-header">
          <span className="admin-categories-badge">Admin Categories</span>
          <h1>Manage Categories</h1>
          <p>Create and organize product categories for SoundShop.</p>
        </div>

        <div className="admin-categories-grid">
          <section className="admin-panel create-category-panel">
            <h2>Create category</h2>

            <form onSubmit={handleCreateCategory} className="category-form">
              <label htmlFor="categoryName">Category name</label>
              <input
                id="categoryName"
                type="text"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create category"}
              </button>
            </form>

            {message && <p className="form-message success">{message}</p>}
            {error && <p className="form-message error">{error}</p>}
          </section>

          <section className="admin-panel categories-list-panel">
            <div className="panel-header">
              <h2>Categories list</h2>
              <span className="categories-count">
                {categories.length} categories
              </span>
            </div>

            {pageLoading ? (
              <p>Loading categories...</p>
            ) : categories.length === 0 ? (
              <p>No categories found.</p>
            ) : (
              <div className="categories-table-wrapper">
                <table className="categories-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>{category.name}</td>
                        <td>
                          {category.created_at
                            ? new Date(category.created_at).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="table-actions">
                          <button
                            className="edit-btn"
                            onClick={() => openEditModal(category)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div
            className="edit-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Edit category</h2>
            <p>Update the category name.</p>
  
            <form onSubmit={handleUpdateCategory} className="edit-category-form">
              <label htmlFor="editCategoryName">Category name</label>
              <input
                id="editCategoryName"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter category name"
              />
  
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
  
                <button type="submit" className="save-btn" disabled={submitting}>
                  {submitting ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;