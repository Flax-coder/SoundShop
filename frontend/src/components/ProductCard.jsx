import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const imageUrl = product.image
    ? `http://127.0.0.1:8000/storage/${product.image}`
    : null;

  const categoryIcons = {
    Guitars: "🎸",
    Pedals: "🎛️",
    Amplifiers: "🔊",
    Accessories: "🎧",
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="product-image"
          />
        ) : (
          <div className="product-placeholder">No Image</div>
        )}
      </div>

      <div className="product-card-body">
        <h3 className="product-title">{product.title}</h3>
        <span className="product-category">
          {categoryIcons[product.category?.name] ?? "🛍️"} {product.category?.name}
        </span>
        <p className="product-description">{product.description}</p>

        <div className="product-card-footer">
          <span className="product-price">
            {Number(product.price).toLocaleString("it-IT", {
              style: "currency",
              currency: "EUR"
            })}
          </span>
          <Link to={`/products/${product.id}`} className="product-button">
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;