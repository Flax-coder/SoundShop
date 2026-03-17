import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "./ProductsPage.css";

function ProductsPage() {
  const { isAuthenticated, isAdmin, loading, token } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const fetchProducts = async () => {
    try {
      setError("");

      const res = await axios.get("http://127.0.0.1:8000/api/admin/products", {
        headers,
      });

      setProducts(res.data);
    } catch (err) {
      console.error("Errore caricamento prodotti:", err);
      setError("Unable to load products.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/categories", {
        headers,
      });

      setCategories(res.data);
    } catch (err) {
      console.error("Errore caricamento categorie:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated && isAdmin && token) {
        setPageLoading(true);
        await Promise.all([fetchProducts(), fetchCategories()]);
        setPageLoading(false);
      } else {
        setPageLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, isAdmin, token]);

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`, {
        headers,
      });

      setMessage("Product deleted successfully.");
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      console.error("Errore eliminazione prodotto:", err);
      setError("Unable to delete product.");
    } finally {
      setSubmitting(false);
    }
  };

    const openEditModal = (product) => {
        setSelectedProduct(product);

        setEditName(
            product.name ?? product.title ?? product.product_name ?? ""
        );

        setEditDescription(
            product.description ?? product.desc ?? ""
        );

        setEditPrice(
            product.price !== null && product.price !== undefined
                ? String(product.price).replace(",", ".")
                : ""
        );

        setEditImage(product.image ?? "");
        setEditCategoryId(product.category_id ?? product.category?.id ?? "");

        setMessage("");
        setError("");
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      setEditName("");
      setEditDescription("");
      setEditPrice("");
      setEditImage("");
      setEditCategoryId("");
    };

    const handleApproveProduct = async (id) => {
      try {
        setSubmitting(true);
        setError("");
        setMessage("");

        await axios.patch(
          `http://127.0.0.1:8000/api/admin/products/${id}/approve`,
          {},
          { headers }
        );

        setMessage("Product approved successfully.");
        fetchProducts();
      } catch (err) {
        console.error("Errore approvazione prodotto:", err);
        setError("Unable to approve product.");
      } finally {
        setSubmitting(false);
      }
    };

    const handleRejectProduct = async (id) => {
      try {
        setSubmitting(true);
        setError("");
        setMessage("");

        await axios.patch(
          `http://127.0.0.1:8000/api/admin/products/${id}/reject`,
          {},
          { headers }
        );

        setMessage("Product rejected successfully.");
        fetchProducts();
      } catch (err) {
        console.error("Errore rifiuto prodotto:", err);
        setError("Unable to reject product.");
      } finally {
        setSubmitting(false);
      }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        if (!selectedProduct) return;

        const normalizedPrice = String(editPrice).replace(",", ".").trim();

        if (!editName.trim()) {
            setError("Product name is required.");
            return;
        }

        if (
            normalizedPrice === "" ||
            isNaN(Number(normalizedPrice)) ||
            Number(normalizedPrice) < 0
        ) {
            setError("Valid price is required.");
            return;
        }

        if (!editCategoryId) {
            setError("Category is required.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            setMessage("");

            await axios.put(
            `http://127.0.0.1:8000/api/products/${selectedProduct.id}`,
            {
                name: editName.trim(),
                description: editDescription.trim(),
                price: Number(normalizedPrice),
                image: editImage.trim(),
                category_id: Number(editCategoryId),
            },
            { headers }
            );

            setMessage("Product updated successfully.");
            closeEditModal();
            fetchProducts();
        } catch (err) {
            console.error("Errore aggiornamento prodotto:", err.response?.data || err);
            setError("Unable to update product.");
        } finally {
            setSubmitting(false);
        }
    };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedStatus("");
  };

  const getCategoryName = (product) => {
    if (product.category?.name) return product.category.name;

    const foundCategory = categories.find(
      (category) => Number(category.id) === Number(product.category_id)
    );

    return foundCategory ? foundCategory.name : "—";
  };

  const getImageSrc = (imagePath) => {
    if (!imagePath) return "";

    const cleanPath = String(imagePath).trim();

    if (
      cleanPath.startsWith("http://") ||
      cleanPath.startsWith("https://")
    ) {
      return cleanPath;
    }

    if (cleanPath.startsWith("/storage/")) {
      return `http://localhost:8000${cleanPath}`;
    }

    if (cleanPath.startsWith("storage/")) {
      return `http://localhost:8000/${cleanPath}`;
    }

    if (cleanPath.startsWith("products/")) {
      return `http://localhost:8000/storage/${cleanPath}`;
    }

    return `http://localhost:8000/storage/products/${cleanPath}`;
  };

  const filteredProducts = products.filter((product) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchesStatus =
      !selectedStatus || product.status === selectedStatus;

    const productName = String(
      product.name ?? product.title ?? product.product_name ?? ""
    ).toLowerCase();

    const matchesName =
      normalizedSearch === "" || productName.includes(normalizedSearch);

    const productCategoryId =
      product.category_id ?? product.category?.id ?? "";

    const matchesCategory =
      !selectedCategory ||
      Number(productCategoryId) === Number(selectedCategory);

    const productPrice = Number(product.price ?? 0);

    const matchesMinPrice =
      minPrice === "" || productPrice >= Number(minPrice);

    const matchesMaxPrice =
      maxPrice === "" || productPrice <= Number(maxPrice);

    return (
      matchesName &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesStatus
    );
  });

  if (loading || pageLoading) {
    return (
      <div className="admin-products-page">
        <div className="admin-products-container">
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
    <div className="admin-products-page">
      <div className="admin-products-container">
        <div className="admin-products-header">
          <span className="admin-products-badge">Admin Products</span>
          <h1>Manage Products</h1>
          <p>Search, filter and manage SoundShop products from one place.</p>
        </div>

        <div className="admin-products-grid">
          <section className="admin-panel filters-panel">
            <h2>Search & filters</h2>

            <div className="product-form">
              <label htmlFor="searchProduct">Search by name</label>
              <input
                id="searchProduct"
                type="text"
                placeholder="Search product name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <label htmlFor="filterCategory">Category</label>
              <select
                id="filterCategory"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <label htmlFor="minPrice">Min price</label>
              <input
                id="minPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="Example: 100"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />

              <label htmlFor="maxPrice">Max price</label>
              <input
                id="maxPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="Example: 500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />

              <label htmlFor="filterStatus">Status</label>
              <select
                id="filterStatus"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <button type="button" onClick={resetFilters}>
                Reset filters
              </button>
            </div>

            {message && <p className="form-message success">{message}</p>}
            {error && <p className="form-message error">{error}</p>}
          </section>

          <section className="admin-panel products-list-panel">
            <div className="panel-header">
              <h2>Products list</h2>
              <span className="products-count">
                {filteredProducts.length} products
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div className="products-table-wrapper">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Created</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          {product.image ? (
                            <img
                              src={getImageSrc(product.image)}
                              alt={product.name ?? product.title ?? product.product_name ?? "Product"}
                              className="product-thumb"
                            />
                          ) : (
                            <span className="no-image">No image</span>
                          )}
                        </td>
                        <td>{product.name ?? product.title ?? product.product_name ?? "—"}</td>
                        <td>{getCategoryName(product)}</td>
                        <td>
                          {product.price !== undefined && product.price !== null
                            ? `€ ${Number(product.price).toFixed(2)}`
                            : "—"}
                        </td>
                        <td>
                          {product.created_at
                            ? new Date(product.created_at).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="table-status">
                          <span className={`product-status ${product.status || "pending"}`}>
                            {product.status || "pending"}
                          </span>
                        </td>
                        <td className="table-actions">
                          {product.status !== "approved" && (
                            <button
                              className="approve-btn"
                              onClick={() => handleApproveProduct(product.id)}
                              disabled={submitting}
                            >
                              Approve
                            </button>
                          )}

                          {product.status !== "rejected" && (
                            <button
                              className="reject-btn"
                              onClick={() => handleRejectProduct(product.id)}
                              disabled={submitting}
                            >
                              Reject
                            </button>
                          )}
                          <button
                            className="edit-btn"
                            onClick={() => openEditModal(product)}
                            disabled={submitting}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={submitting}
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

        {isEditModalOpen && (
          <div className="modal-overlay" onClick={closeEditModal}>
            <div
              className="edit-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Edit product</h2>
              <p>Update product details and category.</p>

              <form onSubmit={handleUpdateProduct} className="edit-product-form">
                <label htmlFor="editProductName">Product name</label>
                <input
                  id="editProductName"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter product name"
                />

                <label htmlFor="editProductDescription">Description</label>
                <textarea
                  id="editProductDescription"
                  rows="4"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Enter product description"
                />

                <label htmlFor="editProductPrice">Price</label>
                <input
                  id="editProductPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="Enter price"
                />

                <label htmlFor="editProductImage">Image filename</label>
                <input
                  id="editProductImage"
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="Example: amp.jpg"
                />

                <label htmlFor="editProductCategory">Category</label>
                <select
                  id="editProductCategory"
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {editImage && (
                  <div className="image-preview-box">
                    <span>Preview</span>
                    <img
                      src={getImageSrc(editImage)}
                      alt={editName || "Product preview"}
                      className="product-thumb preview-thumb"
                    />
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeEditModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-btn"
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;