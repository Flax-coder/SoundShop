import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./CreateProductPage.css";

function CreateProductPage() {
  const { isAuthenticated, loading, token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [dragActive, setDragActive] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Errore caricamento categorie:", err);
        setError("Unable to load categories.");
      } finally {
        setPageLoading(false);
      }
    };

    if (isAuthenticated && token) {
      fetchCategories();
    } else {
      setPageLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setSelectedFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
  };

  const handleFileSelection = (file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, PNG and WEBP images are allowed.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelection(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    handleFileSelection(file);
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedPrice = String(price).replace(",", ".").trim();

    if (!name.trim()) {
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

    if (!categoryId) {
      setError("Category is required.");
      return;
    }

    if (!selectedFile) {
      setError("Product image is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", Number(normalizedPrice));
      formData.append("category_id", Number(categoryId));
      formData.append("image", selectedFile);

      await axios.post("http://127.0.0.1:8000/api/products", formData, {
        headers,
      });

      setMessage("Product submitted for approval. It will be visible after admin review.");
      resetForm();

      setTimeout(() => {
        navigate("/products");
      }, 1500);
    } catch (err) {
      console.error("Errore creazione prodotto:", err.response?.data || err);
      setError("Unable to create product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="create-product-page">
        <div className="create-product-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="create-product-page">
      <div className="create-product-container">
        <div className="create-product-header">
          <span className="create-product-badge">New Product</span>
          <h1>Create Product</h1>
          <p>Add a new product to the SoundShop catalog.</p>
        </div>

        <div className="create-product-layout">
          <section className="create-product-panel">
            <form onSubmit={handleSubmit} className="create-product-form">
              <label htmlFor="productName">Product name</label>
              <input
                id="productName"
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label htmlFor="productDescription">Description</label>
              <textarea
                id="productDescription"
                rows="5"
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label htmlFor="productPrice">Price</label>
              <input
                id="productPrice"
                type="text"
                placeholder="Example: 349.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <label htmlFor="productCategory">Category</label>
              <select
                id="productCategory"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <label>Product image</label>

              <div
                className={`upload-box ${dragActive ? "drag-active" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleChooseFileClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleFileChange}
                  className="hidden-file-input"
                />

                <div className="upload-box-content">
                  <span className="upload-icon">🖼️</span>
                  <p className="upload-title">Drag & drop an image here</p>
                  <p className="upload-subtitle">
                    or click to choose a file
                  </p>

                  {selectedFile && (
                    <p className="selected-file-name">{selectedFile.name}</p>
                  )}
                </div>
              </div>

              <div className="create-product-actions">
                <button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create product"}
                </button>
              </div>
            </form>

            {message && <p className="form-message success">{message}</p>}
            {error && <p className="form-message error">{error}</p>}
          </section>

          <aside
            className={`preview-panel ${dragActive ? "drag-active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <h2>Preview</h2>

            <div className="preview-card">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={name || "Product preview"}
                  className="preview-image"
                />
              ) : (
                <div className="preview-placeholder">Drop image here</div>
              )}

              <h3>{name || "Product name"}</h3>
              <p>{description || "Product description preview."}</p>

              <div className="preview-meta">
                <span>
                  {price
                    ? `€ ${String(price).replace(",", ".")}`
                    : "€ 0.00"}
                </span>

                <span>
                  {categories.find(
                    (category) => Number(category.id) === Number(categoryId)
                  )?.name || "No category"}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CreateProductPage;