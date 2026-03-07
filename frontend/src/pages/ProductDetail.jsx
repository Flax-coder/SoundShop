import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/api";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(id)
      .then((data) => setProduct(data))
      .catch((error) => console.error("Errore dettaglio prodotto:", error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p>Caricamento prodotto...</p>;
  }

  if (!product) {
    return <p>Prodotto non trovato.</p>;
  }

  const imageUrl = product.image
    ? `http://127.0.0.1:8000/storage/${product.image}`
    : null;

  return (
    <div className="product-detail-page">
        <Link to="/products" className="back-link">
        ← Back to products
        </Link>
      <div className="product-detail-card">
        <div className="product-detail-image-wrapper">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title}
              className="product-detail-image"
            />
          ) : (
            <div className="product-placeholder">No Image</div>
          )}
        </div>

        <div className="product-detail-content">
            <h1 className="product-detail-title">{product.title}</h1>
            <p className="product-detail-description">{product.description}</p>
            <p className="product-detail-price">
                {Number(product.price).toLocaleString("it-IT", {
                style: "currency",
                currency: "EUR",
                })}
            </p>

            <button
                onClick={() => {
                    addToCart(product);
                    toast.success("Product added to cart");
                }}
                className="product-button" 
                >
                Add to Cart
            </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;