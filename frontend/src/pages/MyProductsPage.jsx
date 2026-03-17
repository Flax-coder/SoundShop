import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./MyProductsPage.css";

function MyProductsPage() {
  const { isAuthenticated, loading, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/my-products", {
          headers,
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Errore caricamento my products:", err);
        setError("Unable to load your products.");
      } finally {
        setPageLoading(false);
      }
    };

    if (isAuthenticated && token) {
      fetchMyProducts();
    } else {
      setPageLoading(false);
    }
  }, [isAuthenticated, token]);

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

    return `http://localhost:8000/storage/${cleanPath}`;
  };

  if (loading || pageLoading) {
    return (
      <div className="my-products-page">
        <div className="my-products-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="my-products-page">
      <div className="my-products-container">
        <div className="my-products-header">
          <span className="my-products-badge">My Products</span>
          <h1>Your products</h1>
          <p>Here you can see all products created with your account.</p>
        </div>

        <div className="my-products-topbar">
          <Link to="/products/create" className="create-product-btn">
            ➕ Create new product
          </Link>
        </div>

        {error && <p className="my-products-error">{error}</p>}

        {products.length === 0 ? (
          <div className="empty-products-box">
            <h2>No products yet</h2>
            <p>You haven’t created any product yet.</p>
          </div>
        ) : (
          <div className="my-products-grid">
            {products.map((product) => (
              <article key={product.id} className="my-product-card">
                {product.image ? (
                  <img
                    src={getImageSrc(product.image)}
                    alt={product.name ?? product.title ?? "Product"}
                    className="my-product-image"
                  />
                ) : (
                  <div className="my-product-placeholder">No image</div>
                )}

                <div className="my-product-content">
                  <h2>{product.name ?? product.title ?? "Untitled product"}</h2>

                  <p className="my-product-category">
                    {product.category?.name ?? "No category"}
                  </p>

                  <p className="my-product-description">
                    {product.description || "No description available."}
                  </p>

                  <span className={`product-status ${product.status}`}>
                    {product.status}
                  </span>

                  <div className="my-product-footer">
                    <span className="my-product-price">
                      € {Number(product.price ?? 0).toFixed(2)}
                    </span>

                    <span className="my-product-date">
                      {product.updated_at
                        ? new Date(product.updated_at).toLocaleDateString()
                        : product.created_at
                        ? new Date(product.created_at).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                    <div className="my-product-actions">
                        <Link to={`/products/edit/${product.id}`} className="edit-btn">
                            Edit
                        </Link>

                        <button
                            className="delete-btn"
                            onClick={() => handleDelete(product.id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProductsPage;